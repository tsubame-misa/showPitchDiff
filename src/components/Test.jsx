import "../sound";
import { ReactP5Wrapper } from "react-p5-wrapper";
import p5 from "p5";
import "p5/lib/addons/p5.sound";

const sketch = (p) => {
  let sound;
  let amplitude;

  p.preload = () => {
    // サウンドの代わりにオシレーターを使用
    sound = new p5.Oscillator();
    sound.setType("sine");
    sound.freq(442);
    sound.amp(0.5);
    amplitude = new p5.Amplitude();
  };

  p.setup = () => {
    p.createCanvas(400, 400);
  };

  p.draw = () => {
    p.background(255);

    // 音の振幅を取得
    const level = amplitude.getLevel();

    // 振幅に応じて円の大きさを変化させる
    const diameter = p.map(level, 0, 1, 20, 200);

    // 円を描く
    p.ellipse(p.width / 2, p.height / 2, diameter, diameter);
  };

  // ボタンが押されたときに音を再生
  p.mousePressed = () => {
    sound.start();
  };

  // ボタンが離されたときに音を停止
  p.mouseReleased = () => {
    sound.stop();
  };
};

const Test = () => {
  //   const options = { mode: 'p5', audioContext: new (window.AudioContext || window.webkitAudioContext)() };
  //   useP5(playSound, options);

  return (
    <div className="App">
      <ReactP5Wrapper sketch={sketch}></ReactP5Wrapper>
    </div>
  );
};

export default Test;
