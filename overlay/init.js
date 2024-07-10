document.addEventListener("DOMContentLoaded", function () {
    const configUrl = "overlay/config.json"; // URL to your configuration file
    const video = document.getElementById("video");
  
    fetch(configUrl)
      .then(response => response.json())
      .then(config => initializeTool(config));
  
    function initializeTool(config) {
      // Add invisible overlay over video  
      const overlay = document.createElement("div");
      overlay.classList.add("overlay");
      overlay.id = "overlay";
      video.parentElement.style.position = 'relative';
      video.parentElement.appendChild(overlay);
  
      // Add modal that will popup  
      const modal = document.createElement("div");
      modal.classList.add("popup-modal");
      modal.id = "popup-modal";
      overlay.appendChild(modal);
  
      const modalContent = document.createElement("div");
      modalContent.classList.add("modal-content");
      modalContent.innerHTML = `
        <span class="close" id="close">&times;</span>
        <iframe class="modal-iframe" src="" frameborder="0"></iframe>
      `;
      modal.appendChild(modalContent);
  
      const iframe = modalContent.querySelector(".modal-iframe");
      const closeBtn = modalContent.querySelector("#close");
  
      // Pause video and show modal on overlay click
      overlay.addEventListener("click", function () {
        iframe.src = config.link;
        pauseVideo();
        modal.style.display = "block";
        modalContent.classList.add('show-modal');
        modalContent.classList.remove('hide-modal');
      });
  
      // Close the modal
      closeBtn.addEventListener("click", function () {
        modalContent.classList.remove('show-modal');
        modalContent.classList.add('hide-modal');
        setTimeout(() => {
          modal.style.display = "none";
          playVideo();
        }, 1000); // Match the duration of unfoldOut animation
      });
  
      // Close modal when clicking outside of the modal content
      window.addEventListener("click", function (event) {
        if (event.target == modal) {
          modalContent.classList.remove('show-modal');
          modalContent.classList.add('hide-modal');
          setTimeout(() => {
            modal.style.display = "none";
            playVideo();
          }, 1000); // Match the duration of unfoldOut animation
        }
      });
  
      // Show modal at specific timestamps
      video.addEventListener("timeupdate", function () {
        if (config.timestamps.includes(Math.floor(video.currentTime))) {
          iframe.src = config.link;
          pauseVideo();
          modal.style.display = "block";
          modalContent.classList.add('show-modal');
          modalContent.classList.remove('hide-modal');
        }
      });
  
      function pauseVideo() {
        var player = video.contentWindow;
        player.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
      }
  
      function playVideo() {
        var player = video.contentWindow;
        player.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
      }
    }
  });
  