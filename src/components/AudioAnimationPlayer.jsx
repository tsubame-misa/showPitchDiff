import "../sound";
import { ReactP5Wrapper } from "react-p5-wrapper";
import p5 from "p5";
import "p5/lib/addons/p5.sound";


const AudioAnimationPlayer = () => {
  const sketch = (p) => {
    let osc1, osc2;
    let amplitude;
    let changeHz = 442;
    let defaultPitch = 442;
    let fixedHz = 440;
    let button, buttonFixed, buttonChange;

    let isStartAll = false;
    let isStartFixed = false;
    let isStartChange = false;
    let startY;

    p.setup = () => {
      button = p.createButton("all", "red");
      button.position(0, 100);

      buttonFixed = p.createButton("fiexd", "red");
      buttonFixed.position(50, 100);

      buttonChange = p.createButton("change", "red");
      buttonChange.position(100, 100);

      button.mousePressed(() => {
        soundControl();
        changeHz = defaultPitch;
      });

      buttonFixed.mousePressed(() => {
        soundControlFixed();
      });

      buttonChange.mousePressed(() => {
        soundControlChange();
        changeHz = defaultPitch;
      });

      p.createCanvas(400, 200);
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
      p.background(255);
      osc2.freq(changeHz);

      // 音の振幅を取得
      const level = amplitude.getLevel();
      const diameter = p.map(level, 0, 1, 0, 200);

      // 円を描く
      p.noFill();
      p.stroke(0, 255, 0, 100); // 赤い円（442Hzの音に対応）
      p.ellipse(p.width / 2, p.height / 2, diameter, diameter);

      p.fill(0);
      p.text("pitch : " + changeHz, 50, 50);
    };

    p.mouseDragged = () => {
      changeHz += (startY - p.mouseY) * 0.0001;
    };

    p.mousePressed = () => {
      // マウスをクリックしたときの処理
      startY = p.mouseY;
    };

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
      }
    }
  };
  

  return (
    <div className="App">
      <ReactP5Wrapper sketch={sketch} ></ReactP5Wrapper>
    </div>
  );
};
export default AudioAnimationPlayer;
