export const [GCODE, GCODEPOLAR, THETARHO, SVG, SCARA] = [
  "gcode",
  "gcodepolar",
  "thetarho",
  "svg",
  "scara",
]
export const exportTypes = {
  gcode: "GCode (Cartesian)",
  gcodepolar: "GCode (Polar)",
  thetarho: "Theta Rho",
  svg: "SVG",
  scara: "SCARA GCode (experimental)",
}

export const exporterOptions = {
  fileName: {
    title: "File name",
    type: "string",
  },
  fileType: {
    title: "Export as",
    type: "dropdown",
    choices: exportTypes,
  },
  polarRhoMax: {
    title: "Maximum rho value (0-1)",
    min: 0,
    max: 1,
  },
  unitsPerCircle: {
    title: "Units per circle",
    type: "number",
  },
  post: {
    title: "Program end code",
    type: "textarea",
    isVisible: (exporter, state) => {
      return state.fileType !== SVG
    },
  },
  pre: {
    title: "Program start code",
    type: "textarea",
    isVisible: (exporter, state) => {
      return state.fileType !== SVG
    },
  },
  reverse: {
    title: "Reverse path in the code",
  },
}

export default class Exporter {
  constructor(props) {
    this.props = props
    this.lines = []
    this.indentLevel = 0
  }

  export() {
    this.pre = this.props.pre
    this.post = this.props.post
    let vertices = this.props.vertices

    if (this.props.reverse) {
      vertices = vertices.reverse()
    }
    this.computeOutputVertices(vertices)
    this.header()
    this.startComments()
    this.line()
    this.keyValueLine("File name", "'" + this.props.fileName + "'")
    this.keyValueLine("File type", this.props.fileType)
    this.line()
    this.endComments()

    if (this.pre !== "") {
      this.startComments()
      this.line("BEGIN PRE")
      this.endComments()
      this.line(this.pre, this.pre !== "")
      this.startComments()
      this.line("END PRE")
      this.endComments()
    }

    this.line()
    this.exportCode(this.vertices)
    this.line()

    if (this.post !== "") {
      this.startComments()
      this.line("BEGIN POST")
      this.endComments()
      this.line(this.post, this.post !== "")
      this.startComments()
      this.line("END POST")
      this.endComments()
    }
    this.footer()
    this.line()

    return this.lines
  }

  header() {
    // default does nothing
  }

  footer() {
    // default does nothing
  }

  computeOutputVertices(vertices) {
    // default does nothing
    this.vertices = vertices
  }

  line(content = "", add = true) {
    if (add) {
      let padding = ""
      if (this.commenting) {
        padding = this.commentChar + (content.length > 0 ? " " : "")
        for (let i = 0; i < this.indentLevel; i++) {
          padding += "  "
        }
      }
      this.lines.push(padding + this.sanitizeValue(content))
    }
  }

  keyValueLine(key, value, add = true) {
    this.line(key + ": " + value, add)
  }

  indent() {
    this.indentLevel++
  }

  dedent() {
    this.indentLevel--
  }

  startComments() {
    this.commenting = true
  }

  endComments() {
    this.commenting = false
  }

  sanitizeValue(value) {
    return value.replace("\n", " ")
  }
}
