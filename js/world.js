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
var curPage = "";

/********************************************************
 * Content Loading
 ********************************************************/
function loadContent(page) {
    // get page
    if (!sections.includes(page))
        page = "home";

    if (page == curPage)
        return;
    
    clearInterval(wandering);
    var wrapper = $("#content-body-wrapper");
    var delay = 150;


    // reset active page
    $(".option").removeClass("active");
    $("#section-" + page).addClass("active");

    // load content
    wrapper.fadeOut(delay, () => {
        $("#content-body").load("/content/" + page + ".html", () => {
            wrapper.fadeIn(delay);
        });
    });

    curPage = page;
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
curPage = window.location.href.split('#',2)[1];
loadContent(curPage);

console.log("hello, js is ready");
