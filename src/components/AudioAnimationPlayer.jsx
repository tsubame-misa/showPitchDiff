import "../sound";
import { ReactP5Wrapper } from 'react-p5-wrapper';
import p5 from 'p5';
import "p5/lib/addons/p5.sound"

const AudioAnimationPlayer = () => {
    return (
        <div className="App">
            <ReactP5Wrapper sketch={sketch}></ReactP5Wrapper>
        </div>
    );
}

const sketch = (p) => {

  let osc1, osc2;
  let amplitude, amplitude1, amplitude2;

    p.setup = () => {
      p.createCanvas(400, 200);
      osc1 = new p5.Oscillator();
      osc1.setType('sine');
      osc1.freq(442);
      osc1.amp(1.0);

      osc2 = new p5.Oscillator();
      osc2.setType('sine');
      osc2.freq(448);
      osc2.amp(1.0);

      // こっちはダメ
      amplitude1 = new p5.Amplitude();
      amplitude1.setInput(osc1)
      amplitude2 = new p5.Amplitude();
      amplitude2.setInput(osc2)

      // 全体の振幅が取れるっぽいのでこいつが揺らぎ
      amplitude = new p5.Amplitude();
      
    };

    p.draw = () => {
      p.background(255);

      // 音の振幅を取得
      const level1 = amplitude1.getLevel();
      const level2 = amplitude2.getLevel();
      const level = amplitude.getLevel();

      console.log(level1, level2)

      const diameter1 = p.map(level1, 0, 1, 20, 200);
      const diameter2 = p.map(level2, 0, 1, 20, 200);
      const diameter = p.map(level, 0, 1, 20, 200);

      // 円を描く
      p.noStroke();
      p.fill(255, 0, 0, 100); // 赤い円（442Hzの音に対応）
      // p.ellipse(p.width / 2, p.height / 2, diameter1, diameter1);
      p.ellipse(p.width / 4, p.height / 2, diameter1, diameter1);


      p.fill(0, 255, 0, 100); // 赤い円（442Hzの音に対応）
      p.ellipse(p.width / 2, p.height / 2, diameter, diameter);



      p.fill(0, 0, 255, 100); // 青い円（444Hzの音に対応）
      // p.ellipse(p.width / 2, p.height / 2, diameter2, diameter2);
      p.ellipse( (3*p.width) / 4, p.height / 2, diameter2, diameter2);
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
}


export default AudioAnimationPlayer;