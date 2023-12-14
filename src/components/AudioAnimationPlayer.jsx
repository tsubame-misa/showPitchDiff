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

    p.setup = () => {
      p.createCanvas(400, 200);
      osc1 = new p5.Oscillator();
      osc1.setType('sine');
      osc1.freq(442);
      osc1.amp(0.5);

      osc2 = new p5.Oscillator();
      osc2.setType('sine');
      osc2.freq(444);
      osc2.amp(0.5);

      osc1.start();
      osc2.start();
    };

    p.draw = () => {
      p.background(255);

      // アニメーションの処理をここに書く
      // 例えば、円を描く
      const diameter = p.map(p.sin(p.frameCount * 0.05), -1, 1, 20, 200);
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
}


export default AudioAnimationPlayer;