import "../sound";
import { ReactP5Wrapper } from "react-p5-wrapper";
import p5 from "p5";
import "p5/lib/addons/p5.sound";

const AudioAnimationPlayer = () => {
  const canvasSize =
    window.innerWidth <= window.innerHeight ? window.innerWidth : innerHeight;

  const sketch = (p) => {
    let osc1, osc2;
    let amplitude;
    let changeHz = 442;
    let defaultPitch = 442;
    let fixedHz = 440;

    let buttonX = 0;
    let buttonY = 0;

    let buttonFixedX = canvasSize * 0.1;
    let buttonFixedY = 0;

    let buttonChangedX = canvasSize * 0.2;
    let buttonChangedY = 0;

    let buttonW = canvasSize * 0.1;
    let buttonH = canvasSize * 0.05;

    let buttonDebugX = canvasSize * 0.3;
    let buttonDebugY = 0;
    
    let isStartAll = false;
    let isStartFixed = false;
    let isStartChange = false;
    let isShowDebug = false;
    let startY;

    p.setup = () => {
      p.createCanvas(canvasSize, canvasSize);

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
      p.background(200);

      if (isStartAll) {
        drawButton(buttonX, buttonY, "all stop");
      } else {
        drawButton(buttonX, buttonY, "all start");
      }

      if (isStartFixed) {
        drawButton(buttonFixedX, buttonFixedY, "fiexd stop");
      } else {
        drawButton(buttonFixedX, buttonFixedY, "fixed start");
      }

      if (isStartChange) {
        drawButton(buttonChangedX, buttonChangedY, "change stop");
      } else {
        drawButton(buttonChangedX, buttonChangedY, "change start");
      }

      if (isShowDebug) {
        drawButton(buttonDebugX, buttonDebugY, "hide pitch");
      } else {
        drawButton(buttonDebugX, buttonDebugY, "show pitch");
      }

      osc2.freq(changeHz);

      // 音の振幅を取得
      const level = amplitude.getLevel();
      const diameter = p.map(level, 0, 1, 0, canvasSize * 0.8);

      // 円を描く
      p.noFill();
      p.stroke(100); // 赤い円（442Hzの音に対応）
      p.ellipse(p.width / 2, p.height / 2, diameter, diameter);

      if (isShowDebug) {
        p.fill(0);
        p.text("pitch : " + changeHz, 50, 50);
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

    function drawButton(x, y, text) {
      p.fill(230);
      p.rect(x, y, buttonW, buttonH);
      p.fill(0);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(text, x + buttonW / 2, y + buttonH / 2);
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
    <div className="App">
      <div>チューニングしてみよう</div>
      <ReactP5Wrapper sketch={sketch}></ReactP5Wrapper>
    </div>
  );
};
export default AudioAnimationPlayer;
