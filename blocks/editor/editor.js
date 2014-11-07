var Team1 = Team1 || {}

Team1.Editor = function () {
  _.bindAll(this, "onCursorActivity")

  this.codeEditor = CodeMirror.fromTextArea($("#docEditor")[0]
    , { mode: "javascript"
      , lineNumbers: true
      , matchBrackets: true
    }
  )

  this.testCursorsAndSelections()

  this.codeEditor.on("cursorActivity", this.onCursorActivity)
}

Team1.Editor.prototype.onCursorActivity = function () {

}

Team1.Editor.prototype.addCursor = function (cursorInfo) {
  var opt = { className: this.getCursorClass(cursorInfo.id, cursorInfo.color)}
  , to = {
    ch: cursorInfo.position.ch + 1,
    line: cursorInfo.position.line
  }

  this.codeEditor.markText(cursorInfo.position, to, opt)
}
Team1.Editor.prototype.getCursorClass = function (id, color) {
  return "cm-cursor cm-cursor-" + color + " cursor-id-" + id
}

Team1.Editor.prototype.updateCursor = function (cursorInfo) {
  $(".cursor-id-"+cursorInfo.id).remove()
  this.addCursor(cursorInfo)
}

Team1.Editor.prototype.removeCursor = function (id) {
  $("#"+id).remove()
}

Team1.Editor.prototype.addSelection = function (selectionInfo) {
  var opt = { className: "cm-background-"+selectionInfo.color }

  this.codeEditor.markText(selectionInfo.from, selectionInfo.to, opt)
}

Team1.Editor.prototype.testCursorsAndSelections = function () {
  this.addCursor(
    { id: 1
    , position :
      { line:2
      , ch:9
      }
    , color : "red"
    }
  )

  this.addCursor(
    { id: 1
    , position :
      { line:3
      , ch:15
      }
    , color : "green"
    }
  )

  this.addSelection(
    { from :
      { line:0
      , ch:9
      }
    , to :
      { line:1
      , ch:10
      }
    , color : "red"
    }
  )
  this.addSelection(
    { from :
      { line:1
      , ch:1
      }
    , to :
      { line:1
      , ch:20
      }
    , color : "yellow"
    }
  )
}
