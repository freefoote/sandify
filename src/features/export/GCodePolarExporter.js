import ThetaRhoExporter from "./ThetaRhoExporter"

function polargcode(vertex, maxRadius) {
  var degrees = vertex.x * 180 / Math.PI
  return "G1 X" + degrees.toFixed(3) + " Y" + (vertex.y * maxRadius).toFixed(3)
}

export default class GCodePolarExporter extends ThetaRhoExporter {
  constructor(props) {
    super(props)
    this.fileExtension = ".gcode"
    this.label = "Gcode (Polar)"
    this.commentChar = ";"
    this.offsetX = 0
    this.offsetY = 0
  }

  exportCode(vertices) {
    vertices.map((v) => polargcode(v, this.props.maxRadius)).forEach((line) => this.line(line))
  }
}
