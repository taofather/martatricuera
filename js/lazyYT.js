/*!
* lazyYT (lazy load YouTube videos)
* v1.0.1 - 2014-12-30
* (CC) This work is licensed under a Creative Commons Attribution-ShareAlike 4.0 International License.
* http://creativecommons.org/licenses/by-sa/4.0/
* Contributors: https://github.com/tylerpearson/lazyYT/graphs/contributors || https://github.com/daugilas/lazyYT/graphs/contributors
*
* Usage: <div class="lazyYT" data-youtube-id="laknj093n" data-parameters="rel=0">loading...</div>
*/

;(function ($) {
    'use strict';

    function setUp($el, settings) {
        var width = $el.data('width'),
            height = $el.data('height'),
            ratio = ($el.data('ratio')) ? $el.data('ratio') : settings.default_ratio,
            id = $el.data('youtube-id'),
            padding_bottom,
            innerHtml = [],
            $thumb,
            thumb_img,
            loading_text = $el.text() ? $el.text() : settings.loading_text,
            youtube_parameters = $el.data('parameters') || '';

        ratio = ratio.split(":");

        // width and height might override default_ratio value
        if (typeof width === 'number' && typeof height === 'number') {
          $el.width(width);
          padding_bottom = height + 'px';
        } else if (typeof width === 'number') {
          $el.width(width);
          padding_bottom = (width * ratio[1] / ratio[0]) + 'px';
        } else {
          width = $el.width();

          // no width means that container is fluid and will be the size of its parent
          if (width == 0) {
            width = $el.parent().width();
          }

          padding_bottom = (ratio[1] / ratio[0] * 100) + '%';
        }

        //
        // This HTML will be placed inside 'lazyYT' container

        innerHtml.push('<div class="ytp-thumbnail">');

          // Modern YouTube play button (rounded pill shape)
          innerHtml.push('<div class="ytp-large-play-button">');
          innerHtml.push('<svg height="100%" version="1.1" viewBox="0 0 68 48" width="100%">');
            innerHtml.push('<path class="ytp-large-play-button-bg" d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="#FF0000"></path>');
            innerHtml.push('<path d="M 45,24 27,14 27,34" fill="#fff"></path>');
          innerHtml.push('</svg>');
          innerHtml.push('</div>'); // end of .ytp-large-play-button

        innerHtml.push('</div>'); // end of .ytp-thumbnail

        // Video title (info bar)
        // innerHtml.push('<div class="html5-info-bar">');
        // innerHtml.push('<div class="html5-title">');
        // innerHtml.push('<div class="html5-title-text-wrapper">');
        // innerHtml.push('<a id="lazyYT-title-', id, '" class="html5-title-text" target="_blank" tabindex="3100" href="//www.youtube.com/watch?v=', id, '">');
        // innerHtml.push(loading_text);
        // innerHtml.push('</a>');
        // innerHtml.push('</div>'); // .html5-title
        // innerHtml.push('</div>'); // .html5-title-text-wrapper
        // innerHtml.push('</div>'); // end of Video title .html5-info-bar

        $el.css({
            'padding-bottom': padding_bottom
        })
          .html(innerHtml.join(''));

        if (width > 640) {
          thumb_img = 'maxresdefault.jpg';
        } else if (width > 480) {
          thumb_img = 'sddefault.jpg';
        } else if (width > 320) {
          thumb_img = 'hqdefault.jpg';
        } else if (width > 120) {
          thumb_img = 'mqdefault.jpg';
        } else if (width == 0) { // sometimes it fails on fluid layout
          thumb_img = 'hqdefault.jpg';
        } else {
          thumb_img = 'default.jpg';
        }

        $thumb = $el.find('.ytp-thumbnail').css({
            'background-image': ['url(https://img.youtube.com/vi/', id, '/', thumb_img, ')'].join('')
        })
          .addClass('lazyYT-image-loaded')
          .on('click', function (e) {
            e.preventDefault();
            if (!$el.hasClass('lazyYT-video-loaded') && $thumb.hasClass('lazyYT-image-loaded')) {
              $el.html('<iframe src="https://www.youtube.com/embed/' + id + '?autoplay=1&' + youtube_parameters + '" frameborder="0" allowfullscreen></iframe>')
                .addClass('lazyYT-video-loaded');
            }
          });

        /* Taofather: no need for this, not working 404 and video titles rendered in site
         v3 is: https://www.googleapis.com/youtube/v3/videos?id=<video_id>&key=<YOUR_API_KEY>&part=snippet */
        // $.getJSON('//gdata.youtube.com/feeds/api/videos/' + id + '?v=2&alt=json', function (data) {
        //     $el.find('#lazyYT-title-' + id).text(data.entry.title.$t);
        // });

    }

    $.fn.lazyYT = function (newSettings) {
      var defaultSettings = {
        loading_text: 'Loading...',
        default_ratio: '16:9',
        callback: null, // ToDO execute callback if given
        container_class: 'lazyYT-container'
      };
      var settings = $.extend(defaultSettings, newSettings);

      return this.each(function () {
          var $el = $(this).addClass(settings.container_class);
          setUp($el, settings);
      });
    };
}(jQuery));