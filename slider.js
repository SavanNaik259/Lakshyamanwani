  $(document).ready(function () {
        // HOME PAGE SLIDER
        $('.slider_carousel').slick({
            dots: true,
            arrows: false,
            infinite: true,
            pauseOnHover: false,
            speed: 1000,
            autoplay: true,
            autoplaySpeed: 3000,
            SlidesToScroll: 1,
            SlidesToShow: 1
        });
    });
// Independent script for the YouTube video player
document.addEventListener('DOMContentLoaded', function() {
  // Load YouTube API
  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  // Variable to hold the YouTube player
  var youtubePlayer;

  // Function called by YouTube API when ready
  window.onYouTubeIframeAPIReady = function() {
    var youtubeIframe = document.getElementById('independent-youtube');
    if (youtubeIframe) {
      // Initialize player
      youtubePlayer = new YT.Player('independent-youtube', {
        events: {
          'onStateChange': onYoutubePlayerStateChange
        }
      });
    }
  };

  // Handle player state changes
  function onYoutubePlayerStateChange(event) {
    var iframe = document.getElementById('independent-youtube');

    if (event.data === YT.PlayerState.PLAYING) {
      // Video is playing, hide controls
      if (iframe) {
        iframe.src = iframe.src.replace('&controls=1', '&controls=0');
      }
    } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
      // Video is paused or ended, show controls
      if (iframe) {
        iframe.src = iframe.src.replace('&controls=0', '&controls=1');
      }
    }
  }
});


document.addEventListener('DOMContentLoaded', function() {
    // Setup function to initialize video players
    function initializeVideoPlayer(videoId, containerSelector, playBtnId, bigPlayBtnId, progressContainerId, progressBarId, timeDisplayId, volumeBtnId, currentTimeIndicatorId, settingsBtnId, ccBtnId, pipBtnId, fullscreenBtnId) {
        const video = document.getElementById(videoId);
        const videoContainer = containerSelector.querySelector('.custom-video-container');
        const bigPlayBtn = document.getElementById(bigPlayBtnId);
        const playBtn = document.getElementById(playBtnId);
        const progressContainer = document.getElementById(progressContainerId);
        const progressBar = document.getElementById(progressBarId);
        const timeDisplay = document.getElementById(timeDisplayId);
        const volumeBtn = document.getElementById(volumeBtnId);
        const currentTimeIndicator = document.getElementById(currentTimeIndicatorId);
        const settingsBtn = document.getElementById(settingsBtnId);
        const ccBtn = document.getElementById(ccBtnId);
        const pipBtn = document.getElementById(pipBtnId);
        const fullscreenBtn = document.getElementById(fullscreenBtnId);
        const moreBtn = videoContainer.querySelector('.more-btn');

        // Initialize
        let isPlaying = false;
        if (video) {
            video.muted = true;

            // Make sure timestamp is completely hidden by default
            if (currentTimeIndicator) {
                currentTimeIndicator.style.opacity = '0';
                currentTimeIndicator.style.display = 'none';
                currentTimeIndicator.style.visibility = 'hidden';
            }
        } else {
            console.error("Video element not found: " + videoId);
            return; // Exit if video not found
        }

        // Format time in MM:SS format
        function formatTime(seconds) {
            const minutes = Math.floor(seconds / 60);
            seconds = Math.floor(seconds % 60);
            return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        }

        // Update progress bar, time display, and current time indicator position
        function updateProgress() {
            if (video.duration) {
                const progress = (video.currentTime / video.duration) * 100;
                progressBar.style.width = `${progress}%`;
                timeDisplay.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;

                // Update the current time indicator text and position
                if (currentTimeIndicator) {
                    // Update the timestamp display to show current time
                    currentTimeIndicator.textContent = formatTime(video.currentTime);

                    // Position the indicator above the progress bar based on current time
                    const progressContainerWidth = progressContainer.offsetWidth;
                    const indicatorPosition = (video.currentTime / video.duration) * progressContainerWidth;

                    // Get the left position of the progress container for absolute positioning
                    const progressContainerRect = progressContainer.getBoundingClientRect();
                    const videoContainerRect = videoContainer.getBoundingClientRect();
                    const leftOffset = progressContainerRect.left - videoContainerRect.left;

                    // Position the time indicator
                    currentTimeIndicator.style.left = `${leftOffset + indicatorPosition}px`;

                    // Make sure the timestamp is visible during playback
                    if (isPlaying) {
                        currentTimeIndicator.style.opacity = '1 !important';
                        currentTimeIndicator.style.display = 'block !important';
                        currentTimeIndicator.style.visibility = 'visible !important';
                    }
                }
            }
        }

        // Toggle play/pause
        function togglePlay() {
            if (video.paused) {
                video.play();
                playBtn.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="6" y="4" width="4" height="16" fill="white"/>
                        <rect x="14" y="4" width="4" height="16" fill="white"/>
                    </svg>
                `;
                bigPlayBtn.style.display = 'none';
                isPlaying = true;
                videoContainer.classList.add('video-playing');

                // Show the timestamp when playing
                if (currentTimeIndicator) {
                    // Set the bottom position and make it visible
                    currentTimeIndicator.style.bottom = '40px';
                    currentTimeIndicator.style.opacity = '1';
                    currentTimeIndicator.style.display = 'block';
                    currentTimeIndicator.style.visibility = 'visible';
                    // Set background color for better visibility
                    currentTimeIndicator.style.backgroundColor = 'white';
                }
            } else {
                video.pause();
                playBtn.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 3L19 12L5 21V3Z" fill="white"/>
                    </svg>
                `;
                bigPlayBtn.style.display = 'flex';
                isPlaying = false;
                videoContainer.classList.remove('video-playing');
            }
        }

        // Event listeners
        if (bigPlayBtn) bigPlayBtn.addEventListener('click', togglePlay);
        if (playBtn) playBtn.addEventListener('click', togglePlay);
        if (video) {
            video.addEventListener('timeupdate', updateProgress);
            video.addEventListener('click', togglePlay);
        }

        // Fullscreen button
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', function() {
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                } else {
                    videoContainer.requestFullscreen().catch(err => {
                        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
                    });
                }
            });
        }

        // Progress bar click
        if (progressContainer) {
            progressContainer.addEventListener('click', function(e) {
                const rect = progressContainer.getBoundingClientRect();
                const pos = (e.clientX - rect.left) / rect.width;
                video.currentTime = pos * video.duration;
            });
        }
    }

    // Panel creation code for removed video player has been removed

    // Add CSS for all menu panels
    const style = document.createElement('style');
    style.textContent = `
        .settings-panel, .more-panel, .cc-panel {
            position: absolute;
            background-color: rgba(0, 0, 0, 0.92);
            color: white;
            border-radius: 8px;
            padding: 16px;
            z-index: 999;
            display: none;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            font-size: 14px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
            border: 1px solid rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(8px);
        }

        .settings-panel {
            bottom: 60px;
            right: 10px;
            width: 220px;
        }

        .more-panel {
            bottom: 60px;
            right: 10px;
            width: 180px;
        }

        .cc-panel {
            bottom: 60px;
            right: 80px;
            width: 180px;
        }

        .panel-header {
            font-weight: 500;
            margin-bottom: 12px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.15);
            padding-bottom: 8px;
            color: rgba(255, 255, 255, 0.95);
        }

        .panel-section {
            margin-bottom: 12px;
        }

        .section-title {
            font-size: 13px;
            color: rgba(255, 255, 255, 0.8);
            margin-bottom: 8px;
        }

        .settings-select {
            width: 100%;
            background: rgba(255, 255, 255, 0.12);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.2);
            padding: 8px 10px;
            border-radius: 6px;
            cursor: pointer;
            appearance: none;
            background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23FFFFFF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
            background-repeat: no-repeat;
            background-position: right 10px center;
            background-size: 12px;
            padding-right: 28px;
        }

        .settings-select:hover {
            background-color: rgba(255, 255, 255, 0.18);
        }

        .cc-options {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }

        .cc-item {
            padding: 10px 12px;
            color: white;
            cursor: pointer;
            border-radius: 6px;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .cc-item:hover {
            background: rgba(255, 255, 255, 0.15);
        }

        .cc-item.active {
            background: rgba(255, 255, 255, 0.25);
            font-weight: 500;
        }

        .cc-item.active::after {
            content: "✓";
            font-size: 14px;
            margin-left: 8px;
        }

        .more-options {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }

        .option-btn {
            display: flex;
            align-items: center;
            gap: 12px;
            color: white;
            background: transparent;
            border: none;
            padding: 10px 12px;
            cursor: pointer;
            border-radius: 6px;
            width: 100%;
            text-align: left;
            transition: all 0.2s ease;
            font-size: 14px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }

        .option-btn:hover {
            background: rgba(255, 255, 255, 0.15);
        }

        .option-btn:active {
            background: rgba(255, 255, 255, 0.25);
        }

        .option-btn svg {
            flex-shrink: 0;
            width: 16px;
            height: 16px;
        }

        .settings-item select option {
            background-color: #222;
        }

        .more-item, .cc-item {
            padding: 8px 5px;
            cursor: pointer;
        }

        .more-item:hover, .cc-item:hover {
            background-color: rgba(255, 255, 255, 0.1);
        }

        /* Additional cc-item styles have been moved up in the stylesheet */
    `;
    document.head.appendChild(style);

    // Video player functionality for this section has been removed
    // All references to vimeoStyleVideo have been removed as requested

    // Keeping the formatTime function as it's used by the emotional video player
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    // Other video player functions removed as the player has been removed

    // Panel related functionality for removed video player has been removed

    // Additional functionality for removed video player has been removed

    // Event listeners for the removed video player have been removed

    // Initialize panels code removed as panels were for the removed video player

    // Second Video Player (Emotional Moments Video)
    const emotionalVideo = document.getElementById('emotionalMomentsVideo');
    const emotionalBigPlayBtn = document.getElementById('emotionalBigPlayBtn');
    const emotionalPlayBtn = document.getElementById('emotionalPlayBtn');
    const emotionalProgressContainer = document.getElementById('emotionalProgressContainer');
    const emotionalProgressBar = document.getElementById('emotionalProgressBar');
    const emotionalTimeDisplay = document.getElementById('emotionalTimeDisplay');
    const emotionalCurrentTimeIndicator = document.getElementById('emotionalCurrentTimeIndicator');
    const emotionalVolumeBtn = document.getElementById('emotionalVolumeBtn');
    const emotionalFullscreenBtn = document.getElementById('emotionalFullscreenBtn');

    // Emotional video player state - start as true since we have autoplay
    let emotionalIsPlaying = true;

    // Initialize emotional video player
    if (emotionalVideo) {
        // Set autoplay and hide controls by default since it's in "Capturing real emotions..." section
        const emotionalVideoContainer = emotionalVideo.closest('.custom-video-container');

        // Ensure the big play button is hidden since video autoplays
        if (emotionalBigPlayBtn) {
            emotionalBigPlayBtn.style.display = 'none';
        }

        // Panel references for emotional video
        const emotionalSettingsPanel = document.getElementById('emotionalSettingsPanel');
        const emotionalCcPanel = document.getElementById('emotionalCcPanel');
        const emotionalMorePanel = document.getElementById('emotionalMorePanel');

        // Function to hide all panels for emotional video
        function hideEmotionalPanels() {
            if (emotionalSettingsPanel) emotionalSettingsPanel.style.display = 'none';
            if (emotionalCcPanel) emotionalCcPanel.style.display = 'none';
            if (emotionalMorePanel) emotionalMorePanel.style.display = 'none';
        }

        // Hide the big play button initially for autoplay video
        emotionalBigPlayBtn.style.display = 'none';

        // Make sure controls are hidden initially
        emotionalVideoContainer.classList.remove('controls-visible');

        // Completely hide timestamp for autoplay video since it should be hidden during playback
        if (emotionalCurrentTimeIndicator) {
            // Make sure the timestamp is completely hidden initially
            emotionalCurrentTimeIndicator.style.opacity = '0';
            emotionalCurrentTimeIndicator.style.display = 'none';
            emotionalCurrentTimeIndicator.style.visibility = 'hidden';

            // Set the style for when it becomes visible (only when paused)
            emotionalCurrentTimeIndicator.style.backgroundColor = 'white';
            emotionalCurrentTimeIndicator.style.color = 'black';
            emotionalCurrentTimeIndicator.style.padding = '3px 6px';
            emotionalCurrentTimeIndicator.style.borderRadius = '4px';
            emotionalCurrentTimeIndicator.style.fontSize = '12px';
            emotionalCurrentTimeIndicator.style.fontWeight = '500';
        }

        // Ensure the volume icon shows muted state initially since video starts muted for autoplay
        if (emotionalVolumeBtn) {
            emotionalVolumeBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 5L6 9H2V15H6L11 19V5Z" fill="white"/>
                    <line x1="15" y1="9" x2="20" y2="14" stroke="white" stroke-width="2"/>
                    <line x1="15" y1="14" x2="20" y2="9" stroke="white" stroke-width="2"/>
                </svg>
            `;
        }

        // Set up autoplay behavior
        setTimeout(() => {
            emotionalVideo.play()
              .then(() => {
                emotionalIsPlaying = true;
                emotionalPlayBtn.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="6" y="4" width="4" height="16" fill="white"/>
                        <rect x="14" y="4" width="4" height="16" fill="white"/>
                    </svg>
                `;

                // Ensure timestamp is hidden during autoplay
                if (emotionalCurrentTimeIndicator) {
                    emotionalCurrentTimeIndicator.style.opacity = '0';
                    emotionalCurrentTimeIndicator.style.display = 'none';
                    emotionalCurrentTimeIndicator.style.visibility = 'hidden';
                }
              })
              .catch(err => {
                console.log('Autoplay prevented: ', err);
                // If autoplay fails, show controls
                emotionalVideoContainer.classList.add('controls-visible');
              });
        }, 500);

        // Big play button
        emotionalBigPlayBtn.addEventListener('click', function() {
            if (emotionalVideo.paused) {
                emotionalVideo.play();
                emotionalBigPlayBtn.style.display = 'none';
                emotionalPlayBtn.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="6" y="4" width="4" height="16" fill="white"/>
                        <rect x="14" y="4" width="4" height="16" fill="white"/>
                    </svg>
                `;
                emotionalIsPlaying = true;
                // Hide controls after play is clicked
                emotionalVideoContainer.classList.remove('controls-visible');

                // Close all panels when video starts playing
                hideEmotionalPanels();
            }
        });

        // Play/pause button
        emotionalPlayBtn.addEventListener('click', function() {
            const emotionalVideoContainer = emotionalVideo.closest('.custom-video-container');

            if (emotionalVideo.paused) {
                emotionalVideo.play();
                emotionalBigPlayBtn.style.display = 'none';
                emotionalPlayBtn.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="6" y="4" width="4" height="16" fill="white"/>
                        <rect x="14" y="4" width="4" height="16" fill="white"/>
                    </svg>
                `;
                emotionalIsPlaying = true;
                // Hide controls when playing
                emotionalVideoContainer.classList.remove('controls-visible');

                // Close all panels when video starts playing
                hideEmotionalPanels();

                // Make sure timestamp is hidden during playback
                if (emotionalCurrentTimeIndicator) {
                    emotionalCurrentTimeIndicator.style.opacity = '0';
                    emotionalCurrentTimeIndicator.style.display = 'none';
                    emotionalCurrentTimeIndicator.style.visibility = 'hidden';
                }
            } else {
                emotionalVideo.pause();
                emotionalPlayBtn.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 3L19 12L5 21V3Z" fill="white"/>
                    </svg>
                `;
                emotionalBigPlayBtn.style.display = 'flex';
                emotionalIsPlaying = false;
                // Show controls when paused
                emotionalVideoContainer.classList.add('controls-visible');

                // Completely hide the timestamp when paused
                if (emotionalCurrentTimeIndicator) {
                    emotionalCurrentTimeIndicator.style.opacity = '0';
                    emotionalCurrentTimeIndicator.style.display = 'none';
                    emotionalCurrentTimeIndicator.style.visibility = 'hidden';
                }
            }
        });

        // Update progress bar
        emotionalVideo.addEventListener('timeupdate', function() {
            const progress = (emotionalVideo.currentTime / emotionalVideo.duration) * 100;
            emotionalProgressBar.style.width = progress + '%';

            emotionalTimeDisplay.textContent = `${formatTime(emotionalVideo.currentTime)} / ${formatTime(emotionalVideo.duration)}`;

            // Show timestamp with white background during playback for emotional video
            if (emotionalCurrentTimeIndicator) {
                // Update the time indicator position and text
                emotionalCurrentTimeIndicator.textContent = formatTime(emotionalVideo.currentTime);

                // Get the position relative to the video container
                const emotionalVideoContainer = emotionalVideo.closest('.custom-video-container');
                const progressContainerRect = emotionalProgressContainer.getBoundingClientRect();
                const videoContainerRect = emotionalVideoContainer.getBoundingClientRect();
                const leftOffset = progressContainerRect.left - videoContainerRect.left;

                // Calculate the position based on current progress
                const progressContainerWidth = emotionalProgressContainer.offsetWidth;
                const indicatorPosition = (emotionalVideo.currentTime / emotionalVideo.duration) * progressContainerWidth;

                // Position the time indicator
                emotionalCurrentTimeIndicator.style.left = `${leftOffset + indicatorPosition}px`;

                // Make sure the timestamp is hidden during playback
                if (emotionalIsPlaying) {
                    emotionalCurrentTimeIndicator.style.opacity = '0';
                    emotionalCurrentTimeIndicator.style.display = 'none';
                    emotionalCurrentTimeIndicator.style.visibility = 'hidden';
                }
            }
        });

        // Handle clicks on progress bar
        emotionalProgressContainer.addEventListener('click', function(e) {
            const percent = (e.offsetX / emotionalProgressContainer.offsetWidth);
            emotionalVideo.currentTime = percent * emotionalVideo.duration;
        });

        // Volume button
        emotionalVolumeBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent the click from reaching the video
            if (emotionalVideo.muted) {
                emotionalVideo.muted = false;
                emotionalVolumeBtn.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 5L6 9H2V15H6L11 19V5Z" fill="white"/>
                        <path d="M15.54 8.46C16.4774 9.39764 17.0039 10.6692 17.0039 11.995C17.0039 13.3208 16.4774 14.5924 15.54 15.53" stroke="white" stroke-width="2"/>
                        <path d="M19.07 4.93C20.9447 6.80528 21.9979 9.34836 21.9979 12C21.9979 14.6516 20.9447 17.1947 19.07 19.07" stroke="white" stroke-width="2"/>
                    </svg>
                `;
            } else {
                emotionalVideo.muted = true;
                emotionalVolumeBtn.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 5L6 9H2V15H6L11 19V5Z" fill="white"/>
                        <line x1="15" y1="9" x2="20" y2="14" stroke="white" stroke-width="2"/>
                        <line x1="15" y1="14" x2="20" y2="9" stroke="white" stroke-width="2"/>
                    </svg>
                `;
            }
            // Keep controls visible after clicking
            emotionalVideo.closest('.custom-video-container').classList.add('controls-visible');
        });

        // CC button
        emotionalCcBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent the click from reaching the video
            const isVisible = emotionalCcPanel.style.display === 'block';
            hideEmotionalPanels();
            if (!isVisible) {
                emotionalCcPanel.style.display = 'block';
            }
            // Keep controls visible after clicking
            emotionalVideo.closest('.custom-video-container').classList.add('controls-visible');
        });

        // Settings button
        emotionalSettingsBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent the click from reaching the video
            const isVisible = emotionalSettingsPanel.style.display === 'block';
            hideEmotionalPanels();
            if (!isVisible) {
                emotionalSettingsPanel.style.display = 'block';
            }
            // Keep controls visible after clicking
            emotionalVideo.closest('.custom-video-container').classList.add('controls-visible');
        });

        // Speed selector for emotional video
        const emotionalSpeedSelect = document.getElementById('emotionalSpeedSelect');
        if (emotionalSpeedSelect) {
            emotionalSpeedSelect.addEventListener('change', function(e) {
                e.stopPropagation();
                emotionalVideo.playbackRate = parseFloat(e.target.value);
                // Keep controls visible
                emotionalVideo.closest('.custom-video-container').classList.add('controls-visible');
            });
        }

        // CC items for emotional video
        if (emotionalCcPanel) {
            const emotionalCcItems = emotionalCcPanel.querySelectorAll('.cc-item');
            emotionalCcItems.forEach(item => {
                item.addEventListener('click', function(e) {
                    e.stopPropagation();
                    // Remove active class from all items
                    emotionalCcItems.forEach(i => i.classList.remove('active'));
                    // Add active class to clicked item
                    this.classList.add('active');
                    // Close panel after selection
                    emotionalCcPanel.style.display = 'none';
                    // Keep controls visible
                    emotionalVideo.closest('.custom-video-container').classList.add('controls-visible');
                });
            });
        }

        // PIP button
        emotionalPipBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent the click from reaching the video
            if (document.pictureInPictureElement) {
                document.exitPictureInPicture();
            } else if (document.pictureInPictureEnabled) {
                emotionalVideo.requestPictureInPicture();
            }
            // Keep controls visible after clicking
            emotionalVideo.closest('.custom-video-container').classList.add('controls-visible');
        });

        // Fullscreen button
        emotionalFullscreenBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent the click from reaching the video
            if (emotionalVideo.requestFullscreen) {
                emotionalVideo.requestFullscreen();
            } else if (emotionalVideo.webkitRequestFullscreen) {
                emotionalVideo.webkitRequestFullscreen();
            } else if (emotionalVideo.msRequestFullscreen) {
                emotionalVideo.msRequestFullscreen();
            }
            // Keep controls visible after clicking
            emotionalVideo.closest('.custom-video-container').classList.add('controls-visible');
        });

        // Ensure timestamp is hidden when video starts playing
        emotionalVideo.addEventListener('playing', function() {
            // Make sure the timestamp is hidden during playback
            if (emotionalCurrentTimeIndicator) {
                emotionalCurrentTimeIndicator.style.opacity = '0';
                emotionalCurrentTimeIndicator.style.display = 'none';
                emotionalCurrentTimeIndicator.style.visibility = 'hidden';
            }
        });

        // Handle video ending
        emotionalVideo.addEventListener('ended', function() {
            const emotionalVideoContainer = emotionalVideo.closest('.custom-video-container');

            emotionalPlayBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 3L19 12L5 21V3Z" fill="white"/>
                </svg>
            `;
            emotionalBigPlayBtn.style.display = 'flex';
            emotionalIsPlaying = false;

            // Show controls when video ends
            emotionalVideoContainer.classList.add('controls-visible');

            // Hide timestamp when video ends
            if (emotionalCurrentTimeIndicator) {
                emotionalCurrentTimeIndicator.style.opacity = '0';
                emotionalCurrentTimeIndicator.style.display = 'none';
                emotionalCurrentTimeIndicator.style.visibility = 'hidden';
            }
        });

        // Set initial time display once metadata is loaded
        emotionalVideo.addEventListener('loadedmetadata', function() {
            emotionalTimeDisplay.textContent = `0:00 / ${formatTime(emotionalVideo.duration)}`;

            // Start autoplay once metadata is loaded
            if (emotionalVideo.autoplay) {
                // Make sure timestamp is hidden during initial autoplay
                if (emotionalCurrentTimeIndicator) {
                    setTimeout(function() {
                        emotionalCurrentTimeIndicator.style.opacity = '0';
                        emotionalCurrentTimeIndicator.style.display = 'none';
                        emotionalCurrentTimeIndicator.style.visibility = 'hidden';
                    }, 500); // Short delay to ensure video has started playing
                }
            }
        });

        // More button click handler for emotional video
        const emotionalMoreBtn = document.getElementById('emotionalMoreBtn');
        if (emotionalMoreBtn) {
            emotionalMoreBtn.addEventListener('click', function(e) {
                e.stopPropagation(); // Prevent the click from reaching the video
                const isVisible = emotionalMorePanel.style.display === 'block';
                hideEmotionalPanels();

                if (!isVisible) {
                    emotionalMorePanel.style.display = 'block';
                }

                // Keep controls visible after clicking
                emotionalVideo.closest('.custom-video-container').classList.add('controls-visible');
            });
        }

        // Share button functionality for emotional video
        const emotionalShareButton = document.getElementById('emotionalShareButton');
        if (emotionalShareButton) {
            emotionalShareButton.addEventListener('click', function(e) {
                e.stopPropagation();

                // Check if Web Share API is supported
                if (navigator.share) {
                    navigator.share({
                        title: 'AASHI × SARANSH - Wedding Video',
                        url: window.location.href
                    })
                    .then(() => console.log('Shared successfully'))
                    .catch((error) => console.log('Error sharing:', error));
                } else {
                    // Fallback for browsers that don't support the Web Share API
                    const tempInput = document.createElement('input');
                    tempInput.value = window.location.href;
                    document.body.appendChild(tempInput);
                    tempInput.select();
                    document.execCommand('copy');
                    document.body.removeChild(tempInput);

                    // Show a message that URL was copied
                    const message = document.createElement('div');
                    message.textContent = 'URL copied to clipboard!';
                    message.style.cssText = 'position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.8); color: white; padding: 10px 20px; border-radius: 4px; z-index: 9999;';
                    document.body.appendChild(message);

                    setTimeout(() => {
                        document.body.removeChild(message);
                    }, 2000);
                }

                // Close the panel
                emotionalMorePanel.style.display = 'none';
            });
        }

        // Video click to toggle play/pause with control visibility
        emotionalVideo.addEventListener('click', function() {
            const emotionalVideoContainer = emotionalVideo.closest('.custom-video-container');

            if (emotionalVideo.paused) {
                // Play and hide controls
                emotionalVideo.play();
                emotionalBigPlayBtn.style.display = 'none';
                emotionalPlayBtn.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="6" y="4" width="4" height="16" fill="white"/>
                        <rect x="14" y="4" width="4" height="16" fill="white"/>
                    </svg>
                `;
                emotionalIsPlaying = true;
                emotionalVideoContainer.classList.remove('controls-visible');

                // Close all panels when video starts playing
                hideEmotionalPanels();
            } else {
                // Pause and show controls
                emotionalVideo.pause();
                emotionalPlayBtn.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 3L19 12L5 21V3Z" fill="white"/>
                    </svg>
                `;
                emotionalBigPlayBtn.style.display = 'flex';
                emotionalIsPlaying = false;
                emotionalVideoContainer.classList.add('controls-visible');

                // Hide timestamp when paused
                if (emotionalCurrentTimeIndicator) {
                    emotionalCurrentTimeIndicator.style.opacity = '0';
                    emotionalCurrentTimeIndicator.style.display = 'none';
                    emotionalCurrentTimeIndicator.style.visibility = 'hidden';
                }
            }
        });
    }

});
  // Fallback in case YouTube API fails to load
  window.onYouTubeIframeAPIReadyFallback = function() {
    console.log("YouTube API failed to load or call onYouTubeIframeAPIReady");

    // Set a flag to indicate the YouTube API didn't load correctly
    window.youtubeAPIFailed = true;

    // Make sure auto-scrolling still works even if YouTube API fails
    setTimeout(function() {
      if (window.videoSliderInstance && window.videoSliderInstance.startAutoSlide) {
        window.videoSliderInstance.startAutoSlide();
        console.log("Started auto-sliding after YouTube API failure");
      }
    }, 3000);
  };

  // Set a timeout to check if the YouTube API loaded
  setTimeout(function() {
    if (typeof YT === 'undefined' || typeof YT.Player !== 'function') {
      window.onYouTubeIframeAPIReadyFallback();
    }
  }, 5000);


        /**
         * Comprehensive YouTube Video Control System for Slider
         * This handles detecting video play/pause states and controls slider auto-scrolling
         */ 

        // Create a global namespace for video controls - NUCLEAR VERSION
        window.VideoControl = {
            // Set a direct flag that any part of the code can check
            videoPlaying: false,
            players: [],

            // NUCLEAR auto-scroll stopping - kills ALL intervals on the page
            stopAutoScroll: function() {
                console.log('☢️ NUCLEAR AUTO-SCROLL STOP ACTIVATED');

                // Update the global flags immediately
                window.isVideoPlaying = true;
                this.videoPlaying = true;

                // NUCLEAR OPTION: Kill ALL intervals on the page
                const allIntervals = [];
                let id = window.setInterval(function() {}, 0);
                while(id--) {
                    window.clearInterval(id);
                    allIntervals.push(id);
                }
                console.log(`☢️ NUCLEAR: Cleared ${allIntervals.length} intervals`);

                // Clear any tracked intervals list
                if (window._allIntervals) {
                    window._allIntervals = [];
                }

                // Kill any pending auto-slide timers
                const pendingAutoSlideTimers = [];
                let timerId = window.setTimeout(function() {}, 0);
                // Get all existing timeouts by incrementing from current id
                while (timerId--) {
                    window.clearTimeout(timerId);
                    pendingAutoSlideTimers.push(timerId);
                }
                console.log(`☢️ NUCLEAR: Cleared ${pendingAutoSlideTimers.length} timers`);
            },

            // Ultra-simple auto-scroll starting 
            startAutoScroll: function() {
                // Only start if videos aren't playing
                if (this.videoPlaying || window.isVideoPlaying) {
                    console.log('⚠️ Cannot start auto-scroll while video is playing');
                    return;
                }

                // Update the global flag
                window.isVideoPlaying = false;
                this.videoPlaying = false;

                // If we have the slider's start function, call it directly
                if (window.videoSliderInstance && window.videoSliderInstance.startAutoSlide) {
                    window.videoSliderInstance.startAutoSlide();
                    console.log('✅ Auto-scrolling STARTED via slider instance');
                } else {
                    // Find the slider and call its function directly
                    setTimeout(function() {
                        if (typeof startAutoSlide === 'function') {
                            startAutoSlide();
                        }
                    }, 500);
                }
            },

            // NUCLEAR video play handler
            onVideoPlay: function() {
                // Set flags immediately
                window.isVideoPlaying = true;
                this.videoPlaying = true;

                // Kill all intervals and timers
                this.stopAutoScroll();

                console.log('▶️ Video PLAYING - all auto-scrolling killed');
            },

            // Careful video pause detector
            onVideoPause: function() {
                // Set flags immediately
                window.isVideoPlaying = false;
                this.videoPlaying = false;

                console.log('⏸️ Video PAUSED - auto-scroll will resume soon');

                // Simple delay before restarting
                setTimeout(() => {
                    if (!this.videoPlaying && !window.isVideoPlaying) {
                        // Double-check flags to ensure no race conditions
                        if (typeof startAutoSlide === 'function') {
                            startAutoSlide();
                        } else {
                            this.startAutoScroll();
                        }
                    }
                }, 1000);
            }
        };

        /**
         * YouTube API Integration - WITH BETTER ERROR HANDLING
         */

        // Called automatically by YouTube iframe API when it's ready
        function onYouTubeIframeAPIReady() {
            // Add a safety check in case the API is not fully loaded
            if (typeof YT === 'undefined' || typeof YT.Player !== 'function') {
                console.log('YouTube API not fully loaded, using fallback detection');

                // Use the fallback handler
                window.onYouTubeIframeAPIReadyFallback();
                return;
            }

            // Initialize each YouTube player with our event handlers
            ['youtube-video-1', 'youtube-video-2', 'youtube-video-3'].forEach(function(id) {
                try {
                    // Check if element exists first - important fix
                    const element = document.getElementById(id);
                    if (!element) {
                        console.log(`Element with ID ${id} not found, skipping`);
                        return;
                    }

                    const player = new YT.Player(id, {
                        events: {
                            'onStateChange': handleYouTubeStateChange,
                            'onReady': function() {
                                console.log(`YouTube player ${id} is ready`);
                            },
                            'onError': function(event) {
                                console.log(`YouTube player ${id} error:`, event);

                                // Reset the video playing status in case of error
                                if (window.VideoControl) {
                                    window.VideoControl.videoPlaying = false;
                                    window.isVideoPlaying = false;
                                }
                            }
                        }
                    });

                    // Store player reference - only if properly initialized
                    if (player && typeof player.getPlayerState === 'function') {
                        window.VideoControl.players.push(player);
                    }
                } catch (e) {
                    console.log(`Error initializing YouTube player ${id}, using fallback detection`);

                    // Make sure we don't prevent auto-scrolling due to errors
                    if (window.VideoControl) {
                        window.VideoControl.videoPlaying = false;
                        window.isVideoPlaying = false;
                    }
                }
            });

            console.log('✅ YouTube API ready, all players initialized');

            // Ensure auto-scrolling is started
            setTimeout(function() {
                if (typeof startAutoSlide === 'function') {
                    startAutoSlide();
                } else if (window.videoSliderInstance && window.videoSliderInstance.startAutoSlide) {
                    window.videoSliderInstance.startAutoSlide();
                }
            }, 1000);
        }

        // Handle YouTube player state changes - with better error handling
        function handleYouTubeStateChange(event) {
            try {
                // Safety check for VideoControl
                if (!window.VideoControl) {
                    console.log('VideoControl not available, creating emergency version');
                    window.VideoControl = {
                        videoPlaying: false,
                        onVideoPlay: function() {
                            this.videoPlaying = true;
                            window.isVideoPlaying = true;
                            console.log('Video playing - emergency handler');

                            // Find all running intervals and stop them
                            if (window._allIntervals && window._allIntervals.length) {
                                window._allIntervals.forEach(interval => {
                                    clearInterval(interval);
                                });
                                window._allIntervals = [];
                            }
                        },
                        onVideoPause: function() {
                            this.videoPlaying = false;
                            window.isVideoPlaying = false;
                            console.log('Video paused - emergency handler');

                            // Restart auto-scrolling
                            setTimeout(function() {
                                if (typeof startAutoSlide === 'function') {
                                    startAutoSlide();
                                }
                            }, 500);
                        }
                    };
                }

                // YT.PlayerState values: PLAYING=1, PAUSED=2, ENDED=0
                if (event && typeof event.data === 'number') {
                    switch(event.data) {
                        case 1: // Playing
                            window.VideoControl.onVideoPlay();
                            break;

                        case 2: // Paused
                        case 0: // Ended
                            window.VideoControl.onVideoPause();
                            break;

                        default:
                            // Unknown state - assume not playing
                            window.VideoControl.videoPlaying = false;
                            window.isVideoPlaying = false;
                    }
                }
            } catch(e) {
                console.log('Error in YouTube state change handler:', e);

                // Safety reset - ensure auto-scrolling can continue
                window.isVideoPlaying = false;
                if (window.VideoControl) window.VideoControl.videoPlaying = false;

                // Try to restart auto-scrolling
                setTimeout(function() {
                    if (typeof startAutoSlide === 'function') {
                        startAutoSlide();
                    }
                }, 1000);
            }
        }

        // Global function to start auto-sliding that can be called from any context
        function startVideoAutoSlide() {
            if (window.videoSliderInstance && window.videoSliderInstance.startAutoSlide) {
                window.videoSliderInstance.startAutoSlide();
            }
        }

        document.addEventListener('DOMContentLoaded', function() {
            // Initialize the video slider
            window.videoSliderInstance = initVideoSlider();

            // Scroll to top functionality
            const scrollUp = document.getElementById('scrollUp');
            if (scrollUp) {
                scrollUp.addEventListener('click', function() {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                });
            }

            // Initialize the YouTube Video Carousel - SIMPLER VERSION
            function initVideoSlider() {
                // Track if a video is currently playing
                window.isVideoPlaying = false;

                // Get all the necessary elements
                const track = document.querySelector('.video-track');
                const slides = document.querySelectorAll('.video-item');
                const iframes = document.querySelectorAll('.video-item iframe');
                const prevButton = document.querySelector('.prev-btn');
                const nextButton = document.querySelector('.next-btn');
                const dots = document.querySelectorAll('.dot');

                // Set up state variables
                let currentSlide = 0;
                const slideCount = slides.length;
                let autoSlideInterval = null;

                // Global access for debugging
                window.videoDebug = {
                    stopSliding: function() {
                        console.log('MANUAL STOP requested');
                        if (autoSlideInterval) {
                            clearInterval(autoSlideInterval);
                            autoSlideInterval = null;
                            console.log('Auto-sliding FORCEFULLY stopped');
                        }
                    },
                    startSliding: function() {
                        console.log('MANUAL START requested');
                        startAutoSlide();
                    }
                };

                // Add manual event listeners to each iframe to back up the YouTube API events
                // This ensures we still detect video interactions even if the YouTube API fails
                slides.forEach((slide, index) => {
                    // Find the iframe in this slide
                    const iframe = slide.querySelector('iframe');
                    if (iframe) {
                        // Create a transparent overlay that will detect clicks before they reach the iframe
                        const overlay = document.createElement('div');
                        overlay.classList.add('iframe-click-overlay');
                        overlay.style.position = 'absolute';
                        overlay.style.top = '0';
                        overlay.style.left = '0';
                        overlay.style.width = '100%';
                        overlay.style.height = '100%';
                        overlay.style.zIndex = '10';
                        overlay.style.cursor = 'pointer';

                        // Critical setup: Manual YouTube click detection with ULTIMATE NUCLEAR APPROACH
                        overlay.addEventListener('click', function(e) {
                            // Log the event clearly
                            console.log('🎯🎯🎯 MANUAL VIDEO CLICK DETECTED on video ' + (index + 1));

                            // ULTIMATE NUCLEAR APPROACH
                            console.log('☢️☢️☢️ ULTIMATE NUCLEAR STOP ACTIVATED');

                            // 1. Set global flags immediately and permanently for this page session
                            window.isVideoPlaying = true;
                            if (window.VideoControl) window.VideoControl.videoPlaying = true;
                            document.body.setAttribute('data-video-playing', 'true');

                            // 2. Create persistent global kill-switch
                            window.AUTO_SCROLL_PERMANENTLY_DISABLED = true;

                            // 3. Kill ALL intervals on the page using a brutally effective approach
                            let killCount = 0;
                            for (let i = 1; i < 10000; i++) {
                                try {
                                    clearInterval(i);
                                    killCount++;
                                } catch (e) {}
                            }
                            console.log(`☢️ NUCLEAR: Cleared ~${killCount} potential intervals`);

                            // 4. Kill ALL timeouts as well
                            killCount = 0;
                            for (let i = 1; i < 10000; i++) {
                                try {
                                    clearTimeout(i);
                                    killCount++;
                                } catch (e) {}
                            }
                            console.log(`☢️ NUCLEAR: Cleared ~${killCount} potential timeouts`);

                            // 5. Direct call to stop auto-slide function
                            if (typeof stopAutoSlide === 'function') {
                                stopAutoSlide();
                            }

                            // 6. Directly assign null to the interval variable
                            try {
                                window.autoSlideInterval = null;
                                autoSlideInterval = null;
                            } catch (e) {}

                            // 7. Also use the VideoControl object if available
                            if (window.VideoControl && window.VideoControl.onVideoPlay) {
                                window.VideoControl.onVideoPlay();
                            }

                            // 8. OVERRIDE the startAutoSlide function completely
                            window.startAutoSlide = function() {
                                console.log('⛔ Auto-slide permanently disabled due to video interaction');
                                return false;
                            };

                            // Make this overlay inactive so future clicks go through to YouTube
                            this.style.pointerEvents = 'none';

                            // CRITICAL FIX: Click the YouTube iframe directly to start playing immediately
                            // Find the iframe in this slide
                            const iframe = slide.querySelector('iframe');
                            if (iframe) {
                                try {
                                    // Create and dispatch multiple click events to make absolutely sure it works
                                    // 1. Standard click event
                                    iframe.dispatchEvent(new MouseEvent('click', {
                                        bubbles: true,
                                        cancelable: true,
                                        view: window
                                    }));

                                    // 2. Try sending click to the center of the iframe
                                    const rect = iframe.getBoundingClientRect();
                                    const centerX = rect.left + rect.width / 2;
                                    const centerY = rect.top + rect.height / 2;

                                    // Create a centered click event
                                    const centerClickEvent = new MouseEvent('click', {
                                        bubbles: true,
                                        cancelable: true,
                                        view: window,
                                        clientX: centerX,
                                        clientY: centerY
                                    });
                                    iframe.dispatchEvent(centerClickEvent);

                                    // 3. Force play via postMessage API (most reliable method)
                                    try {
                                        iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
                                    } catch (e) {
                                        console.log('PostMessage play attempt error:', e);
                                    }

                                    console.log('🎬🎬🎬 MULTIPLE PLAY ATTEMPTS sent to YouTube iframe');
                                } catch (e) {
                                    console.log('Error forwarding click:', e);
                                }
                            }

                            // Just reset the overlay UI after video likely ends, but DON'T restart auto scrolling
                            setTimeout(() => {
                                console.log('TIMEOUT: Resetting overlay - NOT restarting auto-scroll');

                                // Just reset the slide UI to make clicks work again
                                this.style.pointerEvents = 'auto';

                                // Check if user wants to manually restart scrolling
                                const restartBtn = document.createElement('button');
                                restartBtn.textContent = 'Restart Auto-Scrolling';
                                restartBtn.style.position = 'absolute';
                                restartBtn.style.top = '10px';
                                restartBtn.style.right = '10px';
                                restartBtn.style.zIndex = '20';
                                restartBtn.style.padding = '5px 10px';
                                restartBtn.style.backgroundColor = 'rgba(0,0,0,0.7)';
                                restartBtn.style.color = 'white';
                                restartBtn.style.border = 'none';
                                restartBtn.style.borderRadius = '4px';
                                restartBtn.style.cursor = 'pointer';

                                restartBtn.addEventListener('click', function(e) {
                                    e.stopPropagation(); // Prevent click from reaching the overlay

                                    // Only if user explicitly wants to restart
                                    console.log('USER MANUALLY REQUESTED TO RESTART AUTO-SCROLLING');

                                    // Reset global flags
                                    window.isVideoPlaying = false;
                                    if (window.VideoControl) window.VideoControl.videoPlaying = false;
                                    window.AUTO_SCROLL_PERMANENTLY_DISABLED = false;

                                    // Remove the permanent override
                                    delete window.startAutoSlide;

                                    // Start auto-scrolling if function exists
                                    if (typeof startAutoSlide === 'function') {
                                        startAutoSlide();
                                    }

                                    // Remove this button
                                    this.remove();
                                });

                                // Add button to the slide
                                slide.appendChild(restartBtn);

                                console.log('✓ Optional restart button added to video container');
                            }, 60000); // 1 minute timeout
                        });

                        // Position the overlay correctly
                        slide.style.position = 'relative';
                        slide.appendChild(overlay);
                    }
                });

                // Show a specific slide
                function showSlide(index) {
                    // Update current slide index
                    currentSlide = index;

                    // Move the track to show the current slide
                    track.style.transform = `translateX(-${(100/slideCount) * currentSlide}%)`;

                    // Update active states
                    slides.forEach((slide, i) => {
                        slide.classList.toggle('active', i === currentSlide);
                    });

                    dots.forEach((dot, i) => {
                        dot.classList.toggle('active', i === currentSlide);
                    });
                }

                // Move to the next slide
                function nextSlide() {
                    showSlide((currentSlide + 1) % slideCount);
                }

                // Move to the previous slide
                function prevSlide() {
                    showSlide((currentSlide - 1 + slideCount) % slideCount);
                }

                // Start automatic sliding - Nuclear safety edition
                function startAutoSlide() {
                    // ULTRA CHECK with permanent disable flag
                    if (window.AUTO_SCROLL_PERMANENTLY_DISABLED === true) {
                        console.log('⛔⛔⛔ Auto-sliding permanently disabled by user video interaction');
                        return false;
                    }

                    // Check DOM attribute as well (redundant safety)
                    if (document.body.getAttribute('data-video-playing') === 'true') {
                        console.log('⛔⛔⛔ Auto-sliding disabled via DOM attribute');
                        return false;
                    }

                    // TRIPLE CHECK that no video is playing before starting auto-scroll
                    if (window.isVideoPlaying === true || (window.VideoControl && window.VideoControl.videoPlaying === true)) {
                        console.log('❌❌❌ Cannot start auto-scrolling - video is playing');
                        return false;
                    }

                    // First, ensure any existing interval is cleared
                    if (autoSlideInterval) {
                        clearInterval(autoSlideInterval);
                        autoSlideInterval = null;
                    }

                    // Start a new clean interval
                    autoSlideInterval = setInterval(function() {
                        // Extra safety check before each auto-scroll
                        if (window.isVideoPlaying === true || (window.VideoControl && window.VideoControl.videoPlaying === true)) {
                            console.log('❌❌❌ Stopping interval - video playing detected during auto-scroll');
                            clearInterval(autoSlideInterval);
                            autoSlideInterval = null;
                            return;
                        }

                        // Only advance if no video is playing
                        nextSlide();
                    }, 3000);

                    // Track this interval globally
                    if (!window._allIntervals) window._allIntervals = [];
                    window._allIntervals.push(autoSlideInterval);

                    console.log('✅✅✅ Auto-sliding STARTED with nuclear safety checks');
                }

                // Stop automatic sliding - Ultra simplified
                function stopAutoSlide() {
                    // Always clear the interval if it exists
                    if (autoSlideInterval) {
                        clearInterval(autoSlideInterval);
                        autoSlideInterval = null;
                        console.log('⏹️ Auto-sliding STOPPED');
                    }
                }

                // Event Listeners
                // Previous button click
                if (prevButton) {
                    prevButton.addEventListener('click', () => {
                        prevSlide();
                        stopAutoSlide(); // Stop auto-sliding on user interaction

                        // Restart auto-sliding after 10 seconds of no interaction
                        setTimeout(startAutoSlide, 10000);
                    });
                }

                // Next button click
                if (nextButton) {
                    nextButton.addEventListener('click', () => {
                        nextSlide();
                        stopAutoSlide(); // Stop auto-sliding on user interaction

                        // Restart auto-sliding after 10 seconds of no interaction
                        setTimeout(startAutoSlide, 10000);
                    });
                }

                // Dot indicators click
                dots.forEach((dot, index) => {
                    dot.addEventListener('click', () => {
                        showSlide(index);
                        stopAutoSlide(); // Stop auto-sliding on user interaction

                        // Restart auto-sliding after 10 seconds of no interaction
                        setTimeout(startAutoSlide, 10000);
                    });
                });

                // Initialize first slide
                showSlide(0);

                // Start auto-sliding
                startAutoSlide();

                // Make auto-sliding restart on page load and visibility changes
                window.addEventListener('load', startAutoSlide);

                document.addEventListener('visibilitychange', () => {
                    if (document.visibilityState === 'visible') {
                        startAutoSlide();
                    } else {
                        stopAutoSlide();
                    }
                });

                // Add this line to make the auto-sliding absolutely certain to start
                setTimeout(startAutoSlide, 2000);

                // Make sure it's actually running by adding another auto-start after a few seconds
                setTimeout(() => {
                    if (!autoSlideInterval) {
                        console.log('Forced restart of auto-sliding');
                        startAutoSlide();
                    }
                }, 5000);

                // Return an object with the methods that can be called from outside
                return {
                    nextSlide,
                    prevSlide,
                    showSlide,
                    startAutoSlide,
                    stopAutoSlide
                };
            }

            // Magnetic effect for social links
            const magneticElements = document.querySelectorAll('.magnetic-area');

            magneticElements.forEach(elem => {
                elem.addEventListener('mousemove', function(e) {
                    const position = elem.getBoundingClientRect();
                    const x = e.clientX - position.left - position.width / 2;
                    const y = e.clientY - position.top - position.height / 2;

                    elem.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
                });

                elem.addEventListener('mouseleave', function() {
                    elem.style.transform = 'translate(0px, 0px)';
                });
            });

            // Intersection Observer for animations
            const observerOptions = {
                threshold: 0.5
            };

            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, observerOptions);

            document.querySelectorAll('.footer-info, .logo-container').forEach(el => {
                observer.observe(el);
            });

            // Subtle parallax effect
            window.addEventListener('scroll', function() {
                const scrollPosition = window.scrollY;
                const rotatingText = document.querySelector('.rotating-text');

                if (rotatingText) {
                    const rotateValue = scrollPosition * 0.05;
                    rotatingText.style.transform = `rotate(${rotateValue}deg)`;
                }
            });
        });
