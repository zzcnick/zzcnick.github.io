/********************************************************
 * Globals
 ********************************************************/
var sections = ["about",
                "puzzles", 
                // "cooking",
                "contact",
                "home"
               ];
var wandering = -1;

/********************************************************
 * Content Loading
 ********************************************************/
function loadContent(page) {
    clearInterval(wandering);
    
    var wrapper = $("#content-body-wrapper");
    var delay = 150;

    // get page
    if (!sections.includes(page))
        page = "home";

    // reset active page
    $(".option").removeClass("active");
    $("#section-" + page).addClass("active");

    // load content
    wrapper.fadeOut(delay, () => {
        $("#content-body").load("/content/" + page + ".html", () => {
            wrapper.fadeIn(delay);
        });
    });
}

/********************************************************
 * Event Listeners
 ********************************************************/
for (var s in sections) {
    var addListener = (s) => {
	    $("#section-" + sections[s]).click((e) => {
	        loadContent(sections[s]);
	    });
    };
    addListener(s); // avoid async issues
}

// on startup, load page content based off url
var initPage = window.location.href.split('#',2)[1];
loadContent(initPage);

console.log("hello, js is ready");
