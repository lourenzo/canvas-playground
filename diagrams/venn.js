// Classy ES6 version (check functional too)
// Inspired by this fiddle: http://jsfiddle.net/minitech/MMKK7/


class Circle {
  constructor({ x, y, radius, color } = {}) {
    this.path = new Path2D();
    this.path.arc(x, y, radius, 0, Math.PI * 2, true);
    Object.assign(this, { color, isHover: false });
  }
}

class VennDiagram {
  constructor(element) {
    this.element = element;
    this.canvas = element.getContext('2d');
    if (!this.canvas instanceof CanvasRenderingContext2D) {
      throw new Error(`Unable to get canvas 2d context for element ${element}`);
    }
    this.circles = [];
    this.element.addEventListener('mousemove', (event) => {
      let x = event.offsetX;
      let y = event.offsetY;
      for (let i=0, circle; circle=this.circles[i]; i++) {
        const isHover = this.canvas.isPointInPath(circle.path, event.offsetX, event.offsetY);
        this.circles[i].isHover = isHover;
      }
      this.redrawCircles();
    }, false);
  }
  clear() {
    this.canvas.clearRect(0, 0, this.element.width, this.element.height);
  }
  redrawCircles() {
    this.clear();

    for (const { color, isHover, path } of this.circles) {
      let alpha = '3';
      if (isHover) {
        this.canvas.strokeStyle = color;
        this.canvas.lineWidth = 3;
        this.canvas.stroke(path);
        alpha = '7';
      }
      this.canvas.fillStyle = `${color}${alpha}`;
      this.canvas.fill(path);

    }
  };
  addCircle({ x, y, radius, color, ...extra } = {}) {
    this.circles.push(new Circle({ x, y, radius, color, ...extra }));
    this.redrawCircles();
  }
}

window.addEventListener('load', () => {
  const diagram = new VennDiagram(document.getElementById('venn-diagram'));
  const radius = 100;

  diagram.addCircle({ x: 200, y: 200, radius, color: '#a44', red: true });
  diagram.addCircle({ x: 250, y: 111, radius, color: '#4a4', green: true });
  diagram.addCircle({ x: 300, y: 200, radius, color: '#46a', blue: true });
})