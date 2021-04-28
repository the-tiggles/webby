$(document).ready((function(){var e=e||{},n=n||{},t=t||{},a=a||{},s=s||{},r=r||{},o=o||{},l=l||{},c=c||{},d=d||{},u=u||{},h=h||{},p=$("body.home").length,m=$("body.default").length,g=$("body.reddit").length,f=$("div.sitemap").length,v=$("body > form.http-404").length;e={init:function(){n.init(),t.init(),a.init(),r.init(),o.init(),p&&(s.init(),c.init()),g&&l.init(),m&&d.init(),f&&u.init(),v&&h.init()}},n={init:function(){this.loadIt(),this.checkTab()},loadIt:function(){$.ajaxSetup({cache:!1}),$("#sidebar").load("includes/sidebar.html")},checkTab:function(){setTimeout((function(){var e=$("body").attr("class");$(".sidebar-item#"+e).addClass("active")}),500)}},t={init:function(){this.loadGoogleSearch(),this.searchStyling(),this.portalClicks()},loadGoogleSearch:function(){$.ajaxSetup({cache:!1}),$("#google-search").load("includes/part-search-google.html")},searchStyling:function(){var e=setInterval((function(){$("#google-search input[type='text']").length>=1&&(clearInterval(e),$('#google-search input[type="text"]').attr("placeholder","Search Google"),$(document).on("keydown",(function(e){"Escape"==e.key&&$('#google-search input[type="text"]').is(":focus")&&$('#google-search input[type="text"]').blur(),"Escape"!=e.key||$('#google-search input[type="text"]').is(":focus")||$('#google-search input[type="text"]').focus()})))}),500)},portalClicks:function(){$("#sidebar").on("click",".sidebar-item#home",(function(){s.init(),r.init(),o.init()})),$("#sidebar").on("click",".sidebar-item#reddit",(function(){l.init()}))}},a={init:function(){}},s={init:function(){this.classChanges(),this.transitionContent(),this.homeMain(),this.loadHomeUtility()},classChanges:function(){$("body").attr("class","home"),$(".sidebar-wrapper .sidebar-item.active").removeClass("active"),$(".sidebar-wrapper .sidebar-item#home").addClass("active")},transitionContent:function(){$("#home-content").addClass("transitioning"),setTimeout((function(){$("#home-content").removeClass("transitioning")}),1e3)},homeMain:function(){$("#home-content").load("includes/part-home-main.html")},loadHomeUtility:function(){$("#utility-bar").load("includes/utility-home.html")}},c={init:function(){this.animeListAddBtn(),this.animeListSearch(),this.animeListAddAnime(),this.animeListLoadCookies(),this.animeListClearAll(),this.animeModal()},animeListAddBtn:function(){$(document).on("click",".add-to-list .add-more",(function(){$(".add-to-list").addClass("adding"),$(".add-to-list input").focus()})),$(document).on("click",".add-to-list .clear-search",(function(){$(".add-to-list").removeClass("adding"),$(".add-to-list input").blur(),$(".add-to-list .search-results").empty()}))},animeListSearch:function(){$(document).on("keyup","#anime-search",(function(){var e=$(this).val();$("ul.search-results").empty();var n={search:e},t={method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify({query:"\n          query ($id: Int, $page: Int, $perPage: Int, $search: String) {\n            Page (page: $page, perPage: $perPage) {\n              pageInfo {\n                total\n                currentPage\n                lastPage\n                hasNextPage\n                perPage\n              }\n              media (id: $id, search: $search, type: ANIME) {\n                id\n                coverImage {\n                  medium\n                }\n                \n                title {\n                  romaji\n                  english\n                }\n               \n                 streamingEpisodes {\n                  title\n                }\n              }\n            }\n          }\n          ",variables:n})};fetch("https://graphql.anilist.co",t).then((e=>e.json())).then((e=>{for(var n=0;n<e.data.Page.media.length;n++){var t=e.data.Page.media[n];$('<li data-id="'+t.id+'"><div class="anime-img" style="background-image: url('+t.coverImage.medium+')"></div><span>'+t.title.english+"</span><span>"+t.title.romaji+"</span></li>").appendTo("ul.search-results")}})).catch((e=>console.log("error with the anilist API search")))}))},animeListAddAnime:function(){$("section#main").on("click",".search-results li",(function(){var e={id:$(this).attr("data-id")},n={method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify({query:"\n          query ($id: Int) { # Define which variables will be used in the query (id)\n            Media (id: $id, type: ANIME) { # Insert our variables into the query arguments (id) (type: ANIME is hard-coded in the query)\n              id\n              title {\n                english\n              }\n              streamingEpisodes {\n                title\n                thumbnail\n                url\n                site\n              }\n            }\n          }\n          ",variables:e})};fetch("https://graphql.anilist.co",n).then((function(e){return e.json().then((function(n){return e.ok?n:Promise.reject(n)}))})).then((function(e){var n=e.data.Media.id,t=e.data.Media.title.english,i=e.data.Media.streamingEpisodes[0].title;if($('<li class="'+n+'"><span class="a-name">'+t+'</span><span class="a-episode"><span>'+i+"</span></span></li>").appendTo($("#anime-list > ul")),void 0!==Cookies.get("AnimeList"))animeListArr=JSON.parse(Cookies.get("AnimeList")),animeListArr.push(n),console.log(animeListArr),Cookies.set("AnimeList",JSON.stringify(animeListArr),{expires:365});else{var a=[n];Cookies.set("AnimeList",JSON.stringify(a),{expires:365})}})).catch((function(e){console.log(e)}))}))},animeListLoadCookies:function(){setTimeout((function(){if(void 0!==Cookies.get("AnimeList"))for(var e=JSON.parse(Cookies.get("AnimeList")),n=0;n<e.length;n++){var t={id:e[n]},i={method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify({query:"\n              query ($id: Int) { # Define which variables will be used in the query (id)\n                Media (id: $id, type: ANIME) { # Insert our variables into the query arguments (id) (type: ANIME is hard-coded in the query)\n                  id\n                  title {\n                    english\n                  }\n                  streamingEpisodes {\n                    title\n                    thumbnail\n                    url\n                    site\n                  }\n                }\n              }\n              ",variables:t})};function a(e){return e.json().then((function(n){return e.ok?n:Promise.reject(n)}))}function s(e){var n=e.data.Media.id,t=e.data.Media.title.english,i=e.data.Media.streamingEpisodes[0].title;$('<li class="'+n+'"><span class="a-name">'+t+'</span><span class="a-episode"><span>'+i+"</span></span></li>").appendTo($("#anime-list > ul"))}function r(e){console.log(e)}fetch("https://graphql.anilist.co",i).then(a).then(s).catch(r)}}),300)},animeListClearAll:function(){$("section#main").on("click","a#clear-watchlist",(function(){console.log("the button has been pushed"),Cookies.remove("AnimeList"),$("#anime-list .home-list > li:not(:first-child)").remove()}))},animeModal:function(){$("section#main").on("click","#anime-list li[class]",(function(){var e={id:$(this).attr("class"),page:1,perPage:15},n={method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify({query:"\n          query ($id: Int, $page: Int, $perPage: Int) { \n            Media (id: $id, type: ANIME) {\n              id\n              description\n              updatedAt\n              siteUrl\n              status(version:2)\n              relations{\n                edges{\n                  id \n                  relationType(version:2)\n                  node{\n                    id \n                    title{userPreferred}\n                    format \n                    type \n                    status(version:2)\n                    bannerImage\n                    coverImage{\n                      large\n                    }\n                  }\n                }\n              }\n              recommendations(perPage:7,sort:[RATING_DESC,ID]){\n                pageInfo{\n                  total\n                }\n                nodes{\n                  id \n                  rating \n                  userRating \n                  mediaRecommendation{\n                    id \n                    title{\n                      userPreferred\n                    }\n                    format \n                    type \n                    status(version:2)\n                    bannerImage \n                    coverImage{\n                      large\n                    }\n                  }\n                  user {\n                    id \n                    name \n                    avatar{\n                      large\n                    }\n                  }\n                }\n              }\n              reviews(page:$page, perPage: $perPage, sort:[RATING_DESC,ID]){\n                pageInfo{\n                  total \n                  perPage \n                  currentPage \n                  lastPage \n                  hasNextPage\n                }\n                nodes{\n                  id \n                  summary \n                  rating \n                  ratingAmount \n                  user{\n                    id \n                    name \n                    avatar{\n                      large\n                    }\n                  }\n                }\n              }\n              trailer {\n                site\n                thumbnail\n                id\n              }\n              genres\n              tags {\n                name\n                description\n              }\n              averageScore\n              externalLinks {\n                url\n                site\n              }\n              title {\n                english\n                romaji\n              }\n              coverImage {\n                extraLarge\n              }\n              bannerImage\n              nextAiringEpisode {\n                airingAt\n                timeUntilAiring\n                episode\n              }\n              streamingEpisodes{\n                title\n                thumbnail\n                url\n                site\n                \n              }\n            }\n          }\n          ",variables:e})};fetch("https://graphql.anilist.co",n).then((function(e){return e.json().then((function(n){return e.ok?n:Promise.reject(n)}))})).then((function(e){var n=e.data.Media,t=e.data.Media.streamingEpisodes,a=e.data.Media.tags,s=e.data.Media.externalLinks,r=e.data.Media.genres;for(console.log(n),$("#anime-modal .a-banner-img").css("background-image",'url("'+n.bannerImage+'")'),$("#anime-modal .a-cover-img").css("background-image",'url("'+n.coverImage.extraLarge+'")'),$("#anime-modal .a-user-score").text(n.averageScore),$("#anime-modal .a-title").text(n.title.english),$("#anime-modal .a-title-romaji").text(n.title.romaji),$("#anime-modal .a-description").html(n.description),$(`<li>\n                <div class="embed-container">\n                  <iframe src="https://www.youtube.com/embed/${n.trailer.id}" allowfullscreen"></iframe>\n                </div>\n              </li>      \n            `).appendTo($("#anime-modal ul#a-trailer-list")),i=0;i<t.length;i++)$(`<li>\n                  <div class="image-side" style="background-image:url('${t[i].thumbnail}')"></div>\n                  <div class="copy-side">\n                    <div class="inner-wrapper">\n                      <h4>${t[i].title}</h4>\n                      <ul class="services-list">\n                        <li><a href="${t[i].url}">${t[i].site}</a></li>\n                      </ul>\n                    </div>\n                  </div>\n                </li>`).appendTo($("ul#a-episode-list"));for(i=0;i<s.length;i++)$(`<li>\n                  <a href="${s[i].url}" target="_blank" title="${s[i].site}">${s[i].site}</a>\n                </li>`).appendTo($("#section-links ul"));for(i=0;i<a.length;i++)$(`<li data-attr="${a[i].description}">${a[i].name}</li>`).appendTo($("#section-tags ul"));for(i=0;i<r.length;i++)$(`<li>${r[i]}</li>`).appendTo($("#section-genres ul"));$("#anime-modal").addClass("active")})).catch((function(e){alert("Error, check console"),console.error(e)}))})),$("section#main").on("click","#close-modal",(function(){$("#anime-modal").removeClass("active"),setTimeout((function(){$("#anime-modal .a-banner-img, #anime-modal .a-cover-img").css("background-image",""),$("#anime-modal .a-user-score, #anime-modal .a-title, #anime-modal .a-title-romaji, #anime-modal .a-description, #anime-modal .main-copy > ul").empty()}),500)}))}},r={init:function(){this.registerZip(),this.pullJson(),this.unitChange()},registerZip:function(){function e(){if($("input#userZip").val().length){var e=$("input#userZip").val();Cookies.set("userZip",e,{expires:365}),console.log("cookie is now created w zip of "+e),$("#weather-signin").html("<p>Your zip code has been set to<br>"+e+".</p>"),setTimeout((function(){$("#weather-signin").addClass("hidden"),$("#weather-wrapper").addClass("active")}),3e3)}}userZip=Cookies.get("userZip"),null==userZip?setTimeout((function(){$("#weather-signin").removeClass("hidden")}),1e3):$("#weather-wrapper").addClass("active"),$("#weather-signin .btn-submit").on("click",(function(){e()})),setTimeout((function(){$("input#userZip").bind("keypress",(function(n){13==(n.keyCode||n.which)&&e()}))}),1e3)},pullJson:function(){userUnit=Cookies.get("userWeatherUnit"),null==userUnit||"metric"==userUnit?setTimeout((function(){var e=Cookies.get("userZip");fetch("//api.openweathermap.org/data/2.5/weather?zip="+e+"&appid=d3dbee43ce83080a383c1aae158663ba&units=metric").then((e=>e.json())).then((e=>{var n=e.name,t=e.main.temp,i=e.weather[0].icon,a=e.weather[0].description,s=t.toFixed(1);$(".current-weather .temperature .value").text(s),$(".current-weather .location span").text(n),$(".current-weather .right-side .weather-description").text(a),$(".current-weather .weather-icon").css("background-image",'url("//openweathermap.org/img/wn/'+i+".png"),$("#weather-wrapper").addClass("active")})).catch((e=>console.log("there is a weather map api error")))}),500):setTimeout((function(){var e=Cookies.get("userZip"),n=Cookies.get("userWeatherUnit");fetch("//api.openweathermap.org/data/2.5/weather?zip="+e+"&appid=d3dbee43ce83080a383c1aae158663ba&units="+n).then((e=>e.json())).then((e=>{var n=e.name,t=e.main.temp,i=e.weather[0].icon,a=e.weather[0].description,s=t.toFixed(1);console.log(e),$(".current-weather .temperature .value").text(s),$(".unit-selector a.active").removeClass("active"),$(".unit-selector #imperial").addClass("active"),$(".left-side .temperature.unit-c").removeClass("unit-c").addClass("unit-f"),$(".current-weather .location span").text(n),$(".current-weather .right-side .weather-description").text(a),$(".current-weather .weather-icon").css("background-image",'url("//openweathermap.org/img/wn/'+i+".png"),$("#weather-wrapper").addClass("active")})).catch((e=>console.log("there is a weather map api error")))}),500)},unitChange:function(){$(document).on("click",".unit-selector a",(function(){if(!$(this).hasClass("active")){theUnit=$(this).attr("id");var e=Cookies.get("userZip");fetch("//api.openweathermap.org/data/2.5/weather?zip="+e+"&appid=d3dbee43ce83080a383c1aae158663ba&units="+theUnit).then((e=>e.json())).then((e=>{var n=e.name,t=e.main.temp,i=e.weather[0].icon,a=e.weather[0].description,s=t.toFixed(1);console.log(e),$(".current-weather .temperature .value").text(s),$(".current-weather .location span").text(n),$(".current-weather .right-side .weather-description").text(a),$(".current-weather .weather-icon").css("background-image",'url("//openweathermap.org/img/wn/'+i+".png")})).catch((e=>console.log("there is a weather map api error"))),$(".unit-selector a.active").removeClass("active"),$(this).addClass("active"),Cookies.remove("userWeatherUnit"),Cookies.set("userWeatherUnit",theUnit,{expires:365}),$(".unit-selector #metric.active").length?$(".current-weather .left-side .temperature.unit-f").removeClass("unit-f").addClass("unit-c"):$(".current-weather .left-side .temperature.unit-c").removeClass("unit-c").addClass("unit-f")}return!1}))}},o={init:function(){},fetchNews:function(){options={method:"POST",headers:{"Content-Type":"text/plain",Accept:"application/json"},body:JSON.stringify({})},fetch("https://newsapi.org/v2/everything?apiKey=fe9023de4c4a433d96fbd01d63178a45",options,{mode:"no-cors",credentials:"same-origin"}).then((e=>e.json())).then((function(e){console.log(e)})).catch((function(e){console.log(e)}))},fetchNews2:function(){setTimeout((function(){const e=new XMLHttpRequest;e.withCredentials=!0,e.addEventListener("readystatechange",(function(){if(this.readyState===this.DONE){for(var e=JSON.parse(this.responseText),n=0;n<e.articles.length;n++){var t=e.articles[n],i=t.title,a=t.link;if(null==t.media)var s="/css/images/brand/favi.jpg";else s=t.media;$('<li><a target="_blank" href="'+a+'" style="background-image: url('+s+')"><span>'+i+"</span></a></li>").appendTo("ul.all-news")}$("ul.all-news li").shuffle()}})),e.open("GET","https://newscatcher.p.rapidapi.com/v1/latest_headlines?lang=en&media=True"),e.setRequestHeader("x-rapidapi-key","92d9452a90msh172394c7b5fafe1p104d05jsna7cdba7833a1"),e.setRequestHeader("x-rapidapi-host","newscatcher.p.rapidapi.com"),e.send(null)}),1e3)},shuffleNews:function(){}},l={init:function(){this.classChanges(),this.transitionContent(),this.loadRedditMain(),this.checkLoggedIn()},classChanges:function(){$("body").attr("class","reddit"),$(".sidebar-wrapper .sidebar-item.active").removeClass("active"),$(".sidebar-wrapper .sidebar-item#reddit").addClass("active")},transitionContent:function(){$("#home-content").addClass("transitioning"),setTimeout((function(){$("#home-content").removeClass("transitioning")}),1e3)},loadRedditMain:function(){$("#home-content").load("includes/part-reddit-main.html")},checkLoggedIn(){setTimeout((function(){$("#reddit-login").removeClass("hidden")}),500)}},d={init:function(){}},u={init:function(){}},h={init:function(){}},e.init()}));