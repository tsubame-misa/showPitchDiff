import "../sound";
import { ReactP5Wrapper } from "react-p5-wrapper";
import p5 from "p5";
import "p5/lib/addons/p5.sound";
import "../style.css"

const AudioAnimationPlayer = () => {
  const canvasSizeW = window.innerWidth;
  const canvasSizeH = window.innerHeight * 0.9;

  const sketch = (p) => {
    let osc1, osc2;
    let amplitude;
    let changeHz = 442;
    let defaultPitch = 442;
    let fixedHz = 440;

    let buttonX = 0;
    let buttonY = 0;

    let buttonFixedX = canvasSizeW * 0.1;
    let buttonFixedY = 0;

    let buttonChangedX = canvasSizeW * 0.2;
    let buttonChangedY = 0;

    let buttonW = canvasSizeW * 0.1;
    let buttonWLong = canvasSizeW * 0.15;
    let buttonH = canvasSizeW * 0.05;

    let buttonDebugX = canvasSizeW * 0.3;
    let buttonDebugY = 0;

    let isStartAll = false;
    let isStartFixed = false;
    let isStartChange = false;
    let isShowDebug = false;
    let startY;

    p.setup = () => {
      p.createCanvas(canvasSizeW, canvasSizeH);

      osc1 = new p5.Oscillator();
      osc1.setType("sine");
      osc1.freq(fixedHz);
      osc1.amp(0.5);

      osc2 = new p5.Oscillator();
      osc2.setType("sine");
      osc2.freq(changeHz);
      osc2.amp(0.5);

      // 全体の振幅が取れるっぽいのでこいつが揺らぎ
      amplitude = new p5.Amplitude();
    };

    p.draw = () => {
      p.background(0);

      if (isStartAll) {
        drawButton(buttonX, buttonY, "両方 ◼︎");
      } else {
        drawButton(buttonX, buttonY, "両方 ▶︎");
      }

      if (isStartFixed) {
        drawButton(buttonFixedX, buttonFixedY, "基準音 ◼︎");
      } else {
        drawButton(buttonFixedX, buttonFixedY, "基準音 ▶︎");
      }

      if (isStartChange) {
        drawButton(buttonChangedX, buttonChangedY, "操作音 ◼︎");
      } else {
        drawButton(buttonChangedX, buttonChangedY, "操作音 ▶︎");
      }

      if (isShowDebug) {
        drawButton(buttonDebugX, buttonDebugY, "ピッチを隠す", true);
      } else {
        drawButton(buttonDebugX, buttonDebugY, "ピッチを表示", true);
      }

      osc2.freq(changeHz);

      // 音の振幅を取得
      const level = amplitude.getLevel();
      const diameter = p.map(level, 0, 1, 0, canvasSizeH);

      // 円を描く
      p.noFill();
      if (isStartAll) {
        p.stroke(150, 50, 255); 
      } else if (isStartFixed && !isStartChange) {
        p.stroke(255, 50, 200); 
      } else if (!isStartFixed && isStartChange) {
        p.stroke(50 ,200, 255); 
      } 
      p.ellipse(p.width / 2, p.height / 2, diameter, diameter);


      if (isShowDebug) {
        p.fill(255);
        p.noStroke();
        p.textSize(13)
        p.textAlign(p.CENTER, p.CENTER);

        p.text("基準音 : ", canvasSizeW * 0.5, buttonH / 2);
        p.text("操作音 : ", canvasSizeW * 0.65, buttonH / 2);

        if (isStartFixed) {
          p.text(fixedHz + "Hz", canvasSizeW * 0.565, buttonH / 2);
        } else {
          p.text("- Hz", canvasSizeW * 0.565, buttonH / 2);
        }

        if (isStartChange) {
          p.textAlign(p.LEFT, p.CENTER);
          p.text(Math.floor(changeHz * 10000) / 10000 + "Hz", canvasSizeW * 0.685, buttonH / 2);
          // 設定直す
          p.textAlign(p.CENTER, p.CENTER);
        } else {
          p.text("- Hz", canvasSizeW * 0.715, buttonH/2);
        }
       
      }
    };

    p.mouseDragged = () => {
      changeHz += (startY - p.mouseY) * 0.0001;
    };

    p.mousePressed = () => {
      // マウスをクリックしたときの処理
      startY = p.mouseY;
    };

    p.mouseClicked = () => {
      if (inBox(buttonX, buttonY)) {
        soundControl();
        if (!isStartChange) {
          changeHz = defaultPitch;
        }
      }

      if (inBox(buttonFixedX, buttonFixedY)) {
        soundControlFixed();
      }

      if (inBox(buttonChangedX, buttonChangedY)) {
        soundControlChange();
        changeHz = defaultPitch;
      }

      if (inBox(buttonDebugX, buttonDebugY)) {
        isShowDebug = !isShowDebug;
      }
    };

    function drawButton(x, y, text, isLong = false) {
      let w = buttonW;
      if (isLong) {
        w = buttonWLong
      }
      p.fill(230);
      p.stroke(255);
      p.rect(x, y, w, buttonH);
      p.noStroke();

      p.fill(0);
      p.textSize(12)
      p.textAlign(p.CENTER, p.CENTER);
      p.text(text, x + w / 2, y + buttonH / 2);
    }

    function inBox(x, y) {
      if (inBreadth(p.mouseX, x, buttonW) && inBreadth(p.mouseY, y, buttonH)) {
        return true;
      }
      return false;
    }

    function inBreadth(mouse, pos, d) {
      if (mouse - pos > 0 && mouse - pos < d) {
        return true;
      }
      return false;
    }

    function soundControl() {
      if (isStartAll) {
        osc1.stop();
        osc2.stop();
        isStartAll = !isStartAll;
        isStartChange = false;
        isStartFixed = false;
      } else {
        osc1.start();
        osc2.start();
        isStartAll = !isStartAll;
        isStartChange = true;
        isStartFixed = true;
      }
    }

    function soundControlFixed() {
      if (isStartFixed) {
        osc1.stop();
        isStartFixed = !isStartFixed;
      } else {
        osc1.start();
        isStartFixed = !isStartFixed;
        isStartAll = false;
      }

      if (isStartFixed && isStartChange) {
        isStartAll = true;
      } else {
        isStartAll = false;
      }
    }

    function soundControlChange() {
      if (isStartChange) {
        osc2.stop();
        isStartChange = !isStartChange;
      } else {
        osc2.start();
        isStartChange = !isStartChange;
        isStartAll = false;
      }

      if (isStartFixed && isStartChange) {
        isStartAll = true;
      } else {
        isStartAll = false;
      }
    }
  };

  return (
    <div className="content">
      <ReactP5Wrapper sketch={sketch}></ReactP5Wrapper>
    </div>
  );
};
export default AudioAnimationPlayer;
