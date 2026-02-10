var isRTL = ($('html').attr('dir') == "rtl") ? true : false,
    winWidth = $(window).width(),
    winHeight = $(window).height();

$(function() {
    browserDetect();
});

$(window).on('load', function() {
    // Do after Page ready
    ChangeToSvg();
      videoPlayerInit();
      galleryFancyBox();
        clickfunction();
        validation(".js-form-validation");
        scollBar();
});

$(window).on('resize orientationchange', function() {
    // Do on resize
    winWidth = $(window).width(),
    winHeight = $(window).height();
    scollBar();
});

$(window).on('scroll', function() {
    //Do on Scroll
});

$(document).keyup(function(e) {
    if (e.keyCode == 27) {
        //Do on ESC press
    }
});

function browserDetect() {
    navigator.sayswho = (function() {
        var ua = navigator.userAgent,
            tem,
            M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        if (/trident/i.test(M[1])) {
            tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
            return 'IE ' + (tem[1] || '');
        }
        if (M[1] === 'Chrome') {
            tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
            if (tem != null) return tem.slice(1).join('').replace('OPR', 'Opera');
        }
        M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
        if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
        return M.join(' ');
    })();
    $('body').addClass(navigator.sayswho);
}

function ChangeToSvg() {
    $('img.js-tosvg').each(function () {
        var $img = $(this);
        var imgID = $img.attr('id');
        var imgClass = $img.attr('class');
        var imgURL = $img.attr('src');
        $.get(imgURL, function (data) {
            var $svg = $(data).find('svg');
            if (typeof imgID !== 'undefined') {
                $svg = $svg.attr('id', imgID);
            }
            if (typeof imgClass !== 'undefined') {
                $svg = $svg.attr('class', imgClass + ' insvg');
            }
            $svg = $svg.removeAttr('xmlns:a');
            if (!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
                $svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'))
            }
            $img.replaceWith($svg);
        }, 'xml');
    });
}



    window.document.onkeydown = function (e) {
      if (!e) {
        e = event;
      }
      if (e.keyCode == 27) {
        lightbox_close();
      }
    };
    // video start
// Video functionality
var touchmoved = false;
function clickfunction() {
  $(document)
    .on("touchend click", ".js-dropdownbtn:not(.is--active)", function () {
      if (touchmoved != true) {
        dropdownopen($(this));
      }
    })
    .on("touchend click", ".js-dropdownbtn.is--active", function () {
      if (touchmoved != true) {
      }
    })
    .on("touchend click", function (e) {
      if (touchmoved != true) {
        var gdd = $(".dropdown-box");
        if (!gdd.is(e.target) && gdd.has(e.target).length === 0) {
        }
      }
    })
    .on("touchend click", ".js-videoPopup", function () {
      if (touchmoved != true) {
        videoPopup($(this));
      }
    })
    .on("touchend click", ".parent-cl", function (e) {
      if (touchmoved != true) {
        $(this).parents(".video-box").toggleClass("play-video");
        var etarget = $(e.target);
        // if (winWidth < 1300) {
        //     if (etarget.parents('.video-box').hasClass('play-video')) {
        //         etarget[0].play();
        //     } else {
        //         etarget[0].pause();
        //     }
        // }
      }
    })
    .on("touchmove", function (e) {
      touchmoved = true;
    })
    .on("touchstart", function () {
      touchmoved = false;
    });
}
function videoPopup(target) {
  var $target = $(target);
  var videoUrl;
  var vidPlayer = null;
  if (winWidth < 768) {
    videoUrl = $target.data("mobile-url");
  } else {
    videoUrl = $target.data("desktop-url");
  }
  var videoClass = $target.data("video-class");
  var videoWidth = $target.data("width");
  var videoHeight = $target.data("height");

  var videoType = $target.data("video-type");
  if (videoUrl.split(".mp4")[1] !== undefined) {
    videoType = "video/mp4";
  }

  var videoPoster = $target.data("video-poster") || null;
  var techOrder = ["html5", "youtube"];
  var $content =
    '<div class="popup-video op-0"><video id="lightboxVideo" width="' +
    videoWidth +
    '" height="' +
    videoHeight +
    '" preload="auto" controls autoplay class="video-js vjs-layout-large" data-setup="{}"><source src="' +
    videoUrl +
    '" type="video/mp4" /><p class="vjs-no-js">To view this video please enable JavaScript, and consider upgrading to a web browser that <a href="https://videojs.com/html5-video-support/" target="_blank" rel="noopener noreferrer">supports HTML5 video</a></p></video></div>';
  $.fancybox.open({
    type: "html",
    content: $content,
    beforeShow: function () {
      $("body").addClass("is--videopopup");
      $(".fancybox-container").addClass(videoClass);
    },
    afterShow: function () {
      vidPlayer = videojs("lightboxVideo", function () {
        techOrder;
      });
      vidPlayer.src({
        type: videoType === "youtube" ? "video/youtube" : "video/mp4",
        src:
          videoType === "youtube"
            ? "https://www.youtube.com/watch?v=" + videoUrl
            : videoUrl,
      });
      if (videoPoster) vidPlayer.poster(videoPoster);
      vidPlayer.on("ready", function () {
        vidPlayer.play();
      });
      $(".popup-video").animate(
        {
          opacity: "1",
        },
        500
      );
    },
    beforeClose: function () {
      $("body").removeClass("is--videopopup");
      videojs("lightboxVideo").dispose();
    },
  });
}
var videoPlayerIdIndex = 1;
function videoPlayerInit() {
  $(".my-video-js:not(.my-video-js--updated)").each(function () {
    $(this).on("pause", function () {
      $(this).parents(".video-box").removeClass("play-video");
    });
    $(this).on("play", function () {
      $(this).parents(".video-box").addClass("play-video");
    });
    var thisId = $(this).attr("id");
    $(this).addClass("video-js");
    if (!thisId == "") {
      thisId = "video-id-" + videoPlayerIdIndex;
      $(this).attr("id", thisId);
    }
    var player = videojs(thisId);
    videoPlayerIdIndex++;
    $(this).addClass("my-video-js--updated");
  });
}
function dataSrc() {
  if (winWidth < 768) {
    $("[data-mobile-src]").each(function () {
      var thisSrc = $(this).attr("data-mobile-src");
      $(this).attr("src", thisSrc);
    });
    $("[data-mobile-poster]").each(function () {
      var thisSrc = $(this).attr("data-mobile-poster");
      $(this).attr("poster", thisSrc);
    });
  } else {
    $("[data-desktop-src]").each(function () {
      var thisSrc = $(this).attr("data-desktop-src");
      $(this).attr("src", thisSrc);
    });
    $("[data-desktop-poster]").each(function () {
      var thisSrc = $(this).attr("data-desktop-poster");
      $(this).attr("poster", thisSrc);
    });
  }
}
// video end
function galleryFancyBox() {
  $(document).ready(function () {
    $(".fancybox-gallery").each(function (i, e) {
      $(e).fancybox({
        prevEffect: "none",
        nextEffect: "none",
        closeBtn: false,
        helpers: {
          title: { type: "inside" },
        },
      });
    });
  });
}
function validation(target) {
  if ($(target).length) {
    var $target = $(target);
    $target.each(function (i, e) {
      var v = $target.eq(i).validate({
        errorElement: "span",
        errorClass: "error-txt",
        focusInvalid: false,
        highlight: function (element) {
          $(element).parents(".form-group").addClass("invalid-field");
        },
        unhighlight: function (element) {
          $(element).parents(".form-group").removeClass("invalid-field");
        },
        invalidHandler: function (form, validator, element) {
          var errors = validator.numberOfInvalids();
          if (errors) {
            $(element).parents(".form-group").addClass("invalid-field");
          } else {
            $target.find(".error-msg").hide();
          }
        },
        submitHandler: function (form, validator) {
          
        },
      });
    });
  }
}
jQuery.validator.addMethod("validEmail", (value) => {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value);
});

function scollBar() {
 $(".js-mcs-horizontal").mCustomScrollbar({
   theme: "dark-3",
   advanced: {
     // autoExpandHorizontalScroll: true,
   },
 });
}


