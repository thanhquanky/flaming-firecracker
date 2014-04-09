// connect to our socket server
var socket = io.connect(window.location.href);

var app = app || {};


// shortcut for document.ready
$(function(){
  //setup some common vars
  var $blastField = $('#blast'),
      $allPostsTextArea = $('#allPosts'),
      $clearAllPosts = $('#clearAllPosts'),
      $sendBlastButton = $('#send'),
      $imageField = $('#image'),
      $audioField = $('#audio')

  //SOCKET STUFF
  socket.on("blast", function(data){
    var copy = $allPostsTextArea.html();
    $allPostsTextArea.html('<p>' + copy + data.msg + "</p>");
    $allPostsTextArea.scrollTop($allPostsTextArea[0].scrollHeight - $allPostsTextArea.height());
    //.css('scrollTop', $allPostsTextArea.css('scrollHeight'));

  });

  socket.on("boom", function(data){
    var copy = $allPostsTextArea.html();
    $allPostsTextArea.html('<p>' + copy + '<img src="' + data.msg + '"/>' + "</p>");
    $allPostsTextArea.scrollTop($allPostsTextArea[0].scrollHeight - $allPostsTextArea.height());
    //.css('scrollTop', $allPostsTextArea.css('scrollHeight'));

  });


  socket.on("bow", function(data){
    var copy = $allPostsTextArea.html();
    $allPostsTextArea.html('<p>' + copy + '<audio src="' + data.msg + '" controls></audio></p>"');
    $allPostsTextArea.scrollTop($allPostsTextArea[0].scrollHeight - $allPostsTextArea.height());
    //.css('scrollTop', $allPostsTextArea.css('scrollHeight'));

  });


  $clearAllPosts.click(function(e){
    $allPostsTextArea.text('');
  });

  $sendBlastButton.click(function(e){

    var blast = $blastField.val();

    if(blast.length){
      socket.emit("blast", {msg:blast},
                  function(data){
                    $blastField.val('');
                  });
    }


  });

  $imageField.change(function(e) {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      var file = e.target.files[0];
      var reader = new FileReader();
      reader.onload = function () {
        var image = this.result;
        if (image.length) {
          socket.emit("boom", {image: image},
             function(data) {
                $imageField.val('');
             }
          );
        }
      };
      reader.onProgress = function() {
        console.log(this.progress);
      }
      reader.readAsDataURL(file);

    } else {
      alert('The File APIs are not fully supported by your browser.');
    }
  });

  $audioField.change(function(e) {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      var file = e.target.files[0];
      var reader = new FileReader();
      reader.onload = function () {
        var audio = this.result;
        if (audio.length) {
          socket.emit("bow", {audio: audio},
             function(data) {
                $audioField.val('');
             }
          );
        }
      };
      reader.onProgress = function() {
        console.log(this.progress);
      }
      reader.readAsDataURL(file);

    } else {
      alert('The File APIs are not fully supported by your browser.');
    }
  });

  $blastField.keydown(function (e){
    if(e.keyCode == 13){
      $sendBlastButton.trigger('click');//lazy, but works
    }
  })

});
