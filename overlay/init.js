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
  
      let isModalOpen = false;
  
      // Function to open modal
      function openModal() {
        pauseVideo();
        iframe.src = config.link;
        modal.style.display = "block";
        modalContent.classList.add('show-modal');
        modalContent.classList.remove('hide-modal');
        isModalOpen = true;
      }
  
      // Function to close modal
      function closeModal() {
        modalContent.classList.remove('show-modal');
        modalContent.classList.add('hide-modal');
        setTimeout(() => {
          modal.style.display = "none";
          playVideo();
        }, 1000); // Match the duration of unfoldOut animation
        isModalOpen = false;
      }
  
      // Function to toggle modal
      function toggleModal() {
        if (isModalOpen) {
          closeModal();
        } else {
          openModal();
        }
      }
  
      // Event listeners
      overlay.addEventListener("click", function (event) {
        if (event.target === overlay) {
          toggleModal();
        }
      });
  
      closeBtn.addEventListener("click", closeModal);
  
      video.addEventListener("timeupdate", function () {
        if (config.timestamps.includes(Math.floor(video.currentTime))) {
          openModal();
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
  