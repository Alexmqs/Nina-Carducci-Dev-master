document.addEventListener("DOMContentLoaded", function() {
    const defaults = {
        columns: 3,
        lightBox: true,
        lightboxId: null,
        showTags: true,
        tagsPosition: "bottom",
        navigation: true
    };

    function mauGallery(element, options) {
        options = Object.assign({}, defaults, options);
        let tagsCollection = [];

        createRowWrapper(element);
        if (options.lightBox) {
            createLightBox(element, options.lightboxId, options.navigation);
        }
        addListeners(element, options);

        element.querySelectorAll(".gallery-item").forEach((item) => {
            responsiveImageItem(item);
            moveItemInRowWrapper(item);
            wrapItemInColumn(item, options.columns);
            const theTag = item.getAttribute("data-gallery-tag");
            if (options.showTags && theTag && !tagsCollection.includes(theTag)) {
                tagsCollection.push(theTag);
            }
        });

        if (options.showTags) {
            showItemTags(element, options.tagsPosition, tagsCollection);
        }

        element.style.display = "block";
    }

    function createRowWrapper(element) {
        if (!element.querySelector(".gallery-items-row")) {
            const rowWrapper = document.createElement("div");
            rowWrapper.classList.add("gallery-items-row", "row");
            element.appendChild(rowWrapper);
        }
    }

    function wrapItemInColumn(element, columns) {
        let columnClasses = [];

        if (typeof columns === "number") {
            columnClasses.push(`col-${Math.ceil(12 / columns)}`);
        } else if (typeof columns === "object") {
            if (columns.xs) columnClasses.push(`col-${Math.ceil(12 / columns.xs)}`);
            if (columns.sm) columnClasses.push(`col-sm-${Math.ceil(12 / columns.sm)}`);
            if (columns.md) columnClasses.push(`col-md-${Math.ceil(12 / columns.md)}`);
            if (columns.lg) columnClasses.push(`col-lg-${Math.ceil(12 / columns.lg)}`);
            if (columns.xl) columnClasses.push(`col-xl-${Math.ceil(12 / columns.xl)}`);
        } else {
            console.error(`Les colonnes doivent être définies comme des nombres ou des objets. ${typeof columns} n'est pas pris en charge.`);
            return;
        }

        if (columnClasses.length > 0) {
            const wrapper = document.createElement("div");
            wrapper.classList.add("item-column", "mb-4", ...columnClasses);
            element.parentNode.insertBefore(wrapper, element);
            wrapper.appendChild(element);
        } else {
            console.error("Aucune classe de colonne valide trouvée.");
        }
    }

    function moveItemInRowWrapper(element) {
        const rowWrapper = document.querySelector(".gallery-items-row");
        if (rowWrapper) {
            rowWrapper.appendChild(element);
        }
    }

    function responsiveImageItem(element) {
        if (element.tagName === "IMG") {
            element.classList.add("img-fluid");
        }
    }

    function openLightBox(element, lightboxId) {
        const lightbox = document.getElementById(lightboxId);
        if (lightbox) {
            lightbox.querySelector(".lightboxImage").src = element.src;
            lightbox.classList.add("show");
        }
    }

    function prevImage(lightboxId) {
        let activeImage = null;
        document.querySelectorAll("img.gallery-item").forEach(img => {
            if (img.src === document.querySelector(".lightboxImage").src) {
                activeImage = img;
            }
        });

        let activeTag = document.querySelector(".tags-bar .active-tag").getAttribute("data-images-toggle");
        let imagesCollection = [];
        if (activeTag === "all") {
            document.querySelectorAll(".item-column img").forEach(img => {
                imagesCollection.push(img);
            });
        } else {
            document.querySelectorAll(".item-column img").forEach(img => {
                if (img.getAttribute("data-gallery-tag") === activeTag) {
                    imagesCollection.push(img);
                }
            });
        }

        let index = imagesCollection.indexOf(activeImage) - 1;
        if (index < 0) {
            index = imagesCollection.length - 1;
        }
        document.querySelector(".lightboxImage").src = imagesCollection[index].src;
    }

    function nextImage(lightboxId) {
        let activeImage = null;
        document.querySelectorAll("img.gallery-item").forEach(img => {
            if (img.src === document.querySelector(".lightboxImage").src) {
                activeImage = img;
            }
        });

        let activeTag = document.querySelector(".tags-bar .active-tag").getAttribute("data-images-toggle");
        let imagesCollection = [];
        if (activeTag === "all") {
            document.querySelectorAll(".item-column img").forEach(img => {
                imagesCollection.push(img);
            });
        } else {
            document.querySelectorAll(".item-column img").forEach(img => {
                if (img.getAttribute("data-gallery-tag") === activeTag) {
                    imagesCollection.push(img);
                }
            });
        }

        let index = imagesCollection.indexOf(activeImage) + 1;
        if (index >= imagesCollection.length) {
            index = 0;
        }
        document.querySelector(".lightboxImage").src = imagesCollection[index].src;
    }

    function createLightBox(gallery, lightboxId, navigation) {
        const lightbox = document.createElement("div");
        lightbox.classList.add("modal", "fade");
        lightbox.id = lightboxId ? lightboxId : "galleryLightbox";
        lightbox.tabIndex = -1;
        lightbox.role = "dialog";
        lightbox.setAttribute("aria-hidden", "true");

        const dialog = document.createElement("div");
        dialog.classList.add("modal-dialog");
        dialog.role = "document";

        const content = document.createElement("div");
        content.classList.add("modal-content");

        const body = document.createElement("div");
        body.classList.add("modal-body");

        const prevButton = navigation ? "<div class='mg-prev' style='cursor:pointer;position:absolute;top:50%;left:-15px;background:white;'><</div>" : "<span style='display:none;' />";
        const nextButton = navigation ? "<div class='mg-next' style='cursor:pointer;position:absolute;top:50%;right:-15px;background:white;}'>></div>" : "<span style='display:none;' />";

        body.innerHTML = `${prevButton}<img class="lightboxImage img-fluid" alt="Contenu de l'image affichée dans la modale au clique"/>${nextButton}`;
        content.appendChild(body);
        dialog.appendChild(content);
        lightbox.appendChild(dialog);
        gallery.appendChild(lightbox);
    }

    function showItemTags(gallery, position, tags) {
        let tagItems = "<li class='nav-item'><span class='nav-link active active-tag' data-images-toggle='all'>Tous</span></li>";
        tags.forEach(tag => {
            tagItems += `<li class='nav-item'><span class='nav-link' data-images-toggle='${tag}'>${tag}</span></li>`;
        });

        const tagsRow = `<ul class="my-4 tags-bar nav nav-pills">${tagItems}</ul>`;

        if (position === "bottom") {
            gallery.insertAdjacentHTML("beforeend", tagsRow);
        } else if (position === "top") {
            gallery.insertAdjacentHTML("afterbegin", tagsRow);
        } else {
            console.error(`Position des balises inconnue : ${position}`);
        }
    }

    function filterByTag(event) {
        const clickedTag = event.target;
        if (clickedTag.classList.contains("active-tag")) {
            return;
        }

        document.querySelector(".active-tag").classList.remove("active", "active-tag");
        clickedTag.classList.add("active", "active-tag");

        const tag = clickedTag.getAttribute("data-images-toggle");

        document.querySelectorAll(".gallery-item").forEach(item => {
            const itemColumn = item.closest(".item-column");
            if (itemColumn) {
                itemColumn.style.display = "none";
                if (tag === "all" || item.getAttribute("data-gallery-tag") === tag) {
                    itemColumn.style.display = "block";
                }
            }
        });
    }

    function addListeners(gallery, options) {
        gallery.querySelectorAll(".gallery-item").forEach(item => {
            item.addEventListener("click", function() {
                if (options.lightBox && item.tagName === "IMG") {
                    openLightBox(item, options.lightboxId);
                }
            });
        });

        gallery.addEventListener("click", function(event) {
            if (event.target.classList.contains("nav-link")) {
                filterByTag(event);
            } else if (event.target.classList.contains("mg-prev")) {
                prevImage(options.lightboxId);
            } else if (event.target.classList.contains("mg-next")) {
                nextImage(options.lightboxId);
            }
        });
    }

    // Initialisation de la galerie
    const galleryElement = document.querySelector(".gallery");
    if (galleryElement) {
        mauGallery(galleryElement, {
            columns: {
                xs: 1,
                sm: 2,
                md: 3,
                lg: 3,
                xl: 3
            },
            lightBox: true,
            lightboxId: "myAwesomeLightbox",
            showTags: true,
            tagsPosition: "top"
        });
    }
});
