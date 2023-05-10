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
// old listeners, did not allow back button
// for (var s in sections) {
//     var addListener = (s) => {
// 	    $("#section-" + sections[s]).click((e) => {
// 	        loadContent(sections[s]);
// 	    });
//     };
//     addListener(s); // avoid async issues
// }

// on startup, load page content based off url
loadContent(window.location.href.split('#',2)[1]);

// allows backing up
window.addEventListener("hashchange", function(e) {
    var section = window.location.href.split('#',2)[1];
    console.log(section);
    loadContent(section);
})

console.log("hello, js is ready");
