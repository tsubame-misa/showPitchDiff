import "../sound";
import { ReactP5Wrapper } from "react-p5-wrapper";
import p5 from "p5";
import "p5/lib/addons/p5.sound";

const AudioAnimationPlayer = () => {
  return (
    <div className="App">
      <ReactP5Wrapper sketch={sketch}></ReactP5Wrapper>
    </div>
  );
};

const sketch = (p) => {
  let osc1, osc2;
  let amplitude;

  p.setup = () => {
    p.createCanvas(400, 200);
    osc1 = new p5.Oscillator();
    osc1.setType("sine");
    osc1.freq(442);
    osc1.amp(0.5);

    osc2 = new p5.Oscillator();
    osc2.setType("sine");
    osc2.freq(443);
    osc2.amp(0.5);

    // 全体の振幅が取れるっぽいのでこいつが揺らぎ
    amplitude = new p5.Amplitude();
  };

  p.draw = () => {
    p.background(255);

    // 音の振幅を取得
    const level = amplitude.getLevel();
    const diameter = p.map(level, 0, 1, 20, 200);

    // 円を描く
    p.noStroke();
    p.fill(0, 255, 0, 100); // 赤い円（442Hzの音に対応）
    p.ellipse(p.width / 2, p.height / 2, diameter, diameter);
  };

  p.mousePressed = () => {
    // マウスをクリックしたときの処理
    osc1.start();
    osc2.start();
  };

  p.mouseReleased = () => {
    // マウスを離したときの処理
    osc1.stop();
    osc2.stop();
  };
};

export default AudioAnimationPlayer;
