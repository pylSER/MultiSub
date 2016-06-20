# MultiSub
Javascript library for watching two or more subtitles at the same time in any HTML5 video. Ideally created for showing two subtitles, one
in foreign language, and another in native language for helping with understanding context problems.

You just need to add "data-subing" attribute to any html5 video with tracks:
```Html
<video width="500" height="400" data-subing controls>
            <source src=http://techslides.com/demos/sample-videos/small.mp4 type=video/mp4>
            <source src=http://techslides.com/demos/sample-videos/small.webm type=video/webm>
            <source src=http://techslides.com/demos/sample-videos/small.ogv type=video/ogg>
            Your browser does not support the video tag.
            <track kind="subtitles" src="sub.vtt">
            <track kind="subtitles" src="sub2.vtt">
        </video>
  ```
  -The even tracks will be shown in the top of the video, and the odd in the bottom.<br>
  -Right clicking make showing/hiding all tracks except first, so it's perfect for watching some video in a foreign language, and
  in case of understanding context problems right clicking to see the translation.
  -CSS customization in progress.
