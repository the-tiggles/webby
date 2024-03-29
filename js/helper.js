/* _helper.js */

$(document).ready(function($) {
    var jQuery = $;
  
    // ================================
    // Setup Objects and Selectors
    // ================================
  
    var INIT = INIT || {},
  
        // Global
  
        SIDEBAR = SIDEBAR || {},
        SITEWIDE = SITEWIDE || {},
        STICKY_NAV = STICKY_NAV || {},
        
        // Pages
  
        HOME = HOME || {},
        WEATHER = WEATHER || {},
        NEWS = NEWS || {},
        REDDIT = REDDIT || {},
        ANIME = ANIME || {},
        DEFAULT = DEFAULT || {},
        SITEMAP = SITEMAP || {},
        PAGE_404 = PAGE_404 || {};
  
    var isHome = $('body.home').length,
        isDefault = $('body.default').length,
        isReddit = $('body.reddit').length;
  
  
    // ================================
    // Initiation of all Functions
    // ================================
  
    INIT = {
  
      init: function() {
  
        // Initialize Global Objects
        SIDEBAR.init();
        SITEWIDE.init();
        STICKY_NAV.init();
        WEATHER.init();
        NEWS.init();
        
        // Initialize Page Template Objects
        // if (isHome) { HOME.init(); ANIME.init(); }
        if (isReddit) {REDDIT.init();}
        if (isDefault) { DEFAULT.init(); }
      }
  
    };
  
    // ================================
    // Sidebar
    // ================================
  
    SIDEBAR = {
      init: function() {
        this.loadIt();
        this.checkTab();
      },
      loadIt: function() {
          $.ajaxSetup ({
              cache: false
          });
          $('#sidebar').load('includes/sidebar.html');
      },
      checkTab: function() {
        setTimeout(function() {
          var homeClass =  $("body").attr("class");
          $('.sidebar-item#' + homeClass).addClass("active");
        }, 500)
        
      }
  
     
    };

    // ================================
    // Sitewide
    // ================================
  
    SITEWIDE = {
      init: function() {
        this.loadGoogleSearch();
        this.searchStyling();
        this.portalClicks();
        this.checkHash();
      },
      loadGoogleSearch: function() {
          $.ajaxSetup ({
              cache: false
          });
          $('#google-search').load('includes/part-search-google.html');
      },
      searchStyling: function() {
        function checkForItem(elementName) {
          if ($(elementName).length >= 1) {
              clearInterval(elementChecker);
              //Perform whatever actions you want, here.
              $('#google-search input[type="text"]').attr('placeholder', 'Search Google');
              $(document).on('keydown', function(event) {
                if (event.key =="Escape" && $('#google-search input[type="text"]').is(':focus')) {
                  $('#google-search input[type="text"]').blur();
                }
                if (event.key == "Escape" && !$('#google-search input[type="text"]').is(':focus')) {
                  $('#google-search input[type="text"]').focus();
                } 
              })
          }
        } 
        var elementChecker = setInterval(function() { checkForItem("#google-search input[type='text']"); }, 500);
        
      },
      portalClicks: function() {
        $('#sidebar').on('click', '.sidebar-item#home', function() {
          HOME.init();
          WEATHER.init();
          ANIME.init();
        });
        $('#sidebar').on('click', '.sidebar-item#reddit', function() {
          REDDIT.init();
          WEATHER.init();
        })
      },
      checkHash: function() {

        var theHash = window.location.hash.substring(1);
        if (window.location.hash) {
          console.log('THERE IS a hash')
          // hash be here
          console.log(theHash);
          if (theHash == 'reddit') {
            REDDIT.init();
            WEATHER.init();
          } 
          else {
            // for some reason the oauth return on reddit is a false positive on hash
            HOME.init();
            ANIME.init();
            WEATHER.init();
          }


        } else {
          // no hash
          console.log('no hash here');
          HOME.init();
          ANIME.init();
          WEATHER.init();
        }
      }
  
     
    };
  
    // ================================
    // Sticky Nav
    // ================================
  
    STICKY_NAV = {
      init: function() {
        
      },

    };
  

    // ================================
    // Homepage
    // ================================
  
    HOME = {
      init: function() {
          this.classChanges();
          this.transitionContent();
          this.homeMain();
          this.loadHomeUtility(); 
          // this.redditNews();
      },
      classChanges: function() {
        $('body').attr('class', 'home');

        // sidebar icon active
        $('.sidebar-wrapper .sidebar-item.active').removeClass('active');
        $('.sidebar-wrapper .sidebar-item#home').addClass('active');
      },
      transitionContent: function() {
       
       $('#home-content').addClass('transitioning');
       setTimeout(function() {
         $('#home-content').removeClass('transitioning')
       }, 1000);
        
      },
      homeMain: function() {
        $('#home-content').load('includes/part-home-main.html');
      },
      loadHomeUtility: function() {
        $('#utility-bar').load('includes/utility-home.html');
      },
      redditNews: function() {


        function createAuth1() {
          console.log('creating auth');
          const authenticationUrl = snoowrap.getAuthUrl({
            clientId: '8KyK8FAzO_5T6A',
            scope: ['identity', 'subscribe', 'history', 'account', 'submit', 'save', 'report', 'read', 'edit', 'vote', 'mysubreddits'],
            redirectUri: 'https://the-tiggles.github.io/webby',
            permanent: true,
            state: '03141990'
          });
          window.location = authenticationUrl;
        }

        function useAuth() {

          // set those vars
          var code = new URL(window.location.href).searchParams.get('code');
          var state = new URL(window.location.href).searchParams.get('state');

          // remove the auth from the url
          var clean_uri = location.protocol + "//" + location.host + location.pathname;
          window.history.replaceState({}, document.title, clean_uri);

          snoowrap.fromAuthCode({
            code: code,
            userAgent: 'Tiggles Installed App on Browser',
            clientId: '8KyK8FAzO_5T6A',
            clientSecret: '',
            redirectUri: 'https://the-tiggles.github.io/webby'
          }).then(r => {
            return r.getHot({limit: 7}).then(posts => {
              console.log(posts);
              for (i = 0; i < posts.length; i++) {
                $(`
                <li>
                    <div class="upvote-wrapper">
                        <div class="upvote-arrow"></div>
                        <span class="upvote-count">${posts[i].score}</span>
                        <div class="downvote-arrow"></div>
                    </div>
                    <div class="content-wrapper">
                        <div class="post-info">
                            <div class="post-meta-info">
                                <a href="//reddit.com/${posts[i].subreddit_name_prefixed}" class="post-community">
                                    <div class="post-community-image">
                                    </div>
                                    <span class="post-community-name">${posts[i].subreddit_name_prefixed}</span>
                                </a>
                                <span class="post-author">
                                    Posted by&nbsp;${posts[i].author_fullname}&nbsp;${posts[i].created} ago
                                </span>
                                <ul class="post-flair">
                                    ${posts[i].all_awardings.map((award) => `
                                        <li>
                                            <div class="flair-img"><img src="${award.icon_url}" alt="${award.description}"></div>
                                            <span class="flair-count">${award.count}</span>
                                        </li>
                                    `).join('')}
                                </ul>
                            </div>
                            <p class="post-title"><a href="//reddit.com${posts[i].permalink}">${posts[i].title}</a></p>
                            <div class="post-preview">
                             
                            </div>
                            <div class="post-footer-info">
                                <div class="comments">
                                    <span>${posts[i].num_comments} Comments</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
                `).appendTo('#news-list ul.all-news');
              }
            });
          });
        }
        createAuth1();
        useAuth();

        












        function createInstance(refreshToken) {
          return new snoowrap({
            userAgent: 'Tiggles Installed App',
            clientId: '8KyK8FAzO_5T6A',
            clientSecret: '',
            refreshToken: '-Yf_ltB3obqY3oYtEjlaJbCk9VxEeXQ'
          })
        }

        var theInstance = createInstance(code);
        // var response = await theInstance.catch((err) => { console.error(err); });
        try {
          console.log(response);
        } catch(e) {
          console.log('doing this thaaang')
          console.log(JSON.stringify(e, null, 2));
        }

        
      }
    };

    // ================================
    // Anime
    // ================================

    ANIME = {
      init: function() {
        this.animeListAddBtn();
        this.animeListSearch();
        this.animeListAddAnime();
        this.animeListLoadCookies();
        this.animeListClearAll(); 
        this.animeModal();
      },
      animeListAddBtn: function() {
        $(document).on('click', '.add-to-list .add-more', function() {
          $('.add-to-list').addClass('adding');
          $('.add-to-list input').focus();
        })
        $(document).on('click', '.add-to-list .clear-search', function() {
          $('.add-to-list').removeClass('adding');
          $('.add-to-list input').blur();
          $('.add-to-list .search-results').empty();
        });
      },
      animeListSearch: function() {
        $(document).on('keyup', '#anime-search', function() {
          var userSearch = $(this).val();
          $('ul.search-results').empty();
          // console.log(userSearch);
        
          var query = `
          query ($id: Int, $page: Int, $perPage: Int, $search: String) {
            Page (page: $page, perPage: $perPage) {
              pageInfo {
                total
                currentPage
                lastPage
                hasNextPage
                perPage
              }
              media (id: $id, search: $search, type: ANIME) {
                id
                coverImage {
                  medium
                }
                
                title {
                  romaji
                  english
                }
               
                 streamingEpisodes {
                  title
                }
              }
            }
          }
          `;
          var variables = {
            search: userSearch
          };
          var url = 'https://graphql.anilist.co',
          options = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }, 
            body: JSON.stringify({
              query:query,
              variables: variables
            })
          };
          fetch(url, options)
          .then(response => response.json())
          .then(data => {
            // console.log(data);
            for (var i = 0; i < data['data']['Page']['media'].length; i++) {
              var obj = data['data']['Page']['media'][i];
              
              $('<li data-id="'+obj.id+'"><div class="anime-img" style="background-image: url('+obj.coverImage.medium+')"></div><span>'+obj.title.english+'</span><span>'+obj.title.romaji+'</span></li>').appendTo('ul.search-results');
            }


          })
          .catch(err => console.log('error with the anilist API search'));
        })
      },
      animeListAddAnime: function() {
        $('section#main').on('click', '.search-results li', function() {
          var selectedAnimeID = $(this).attr('data-id');
          var query = `
          query ($id: Int) { # Define which variables will be used in the query (id)
            Media (id: $id, type: ANIME) { # Insert our variables into the query arguments (id) (type: ANIME is hard-coded in the query)
              id
              title {
                english
              }
              streamingEpisodes {
                title
                thumbnail
                url
                site
              }
            }
          }
          `;
          var variables = {
            id: selectedAnimeID
          }

          var url = 'https://graphql.anilist.co',
          options = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              query: query,
              variables: variables
            })
          };
          fetch(url, options)
          .then(handleResponse)
          .then(handleData)
          .catch(handleError);

          function handleResponse(response) {
            return response.json().then(function (json) {
              return response.ok ? json : Promise.reject(json);
            });
          }
          function handleData(data) {
            // console.log(data);
            var animeID = data.data.Media.id;
            var animeName = data.data.Media.title.english;
            var newestEpisode = data.data.Media.streamingEpisodes[0].title;
           
            $('<li class="'+animeID+'"><span class="a-name">'+animeName+'</span><span class="a-episode"><span>'+newestEpisode+'</span></span></li>').appendTo($('#anime-list > ul'));

            // create a cookie
            
           
            if (Cookies.get('AnimeList') !== undefined) {

              //read the cookie
              // write to the cookie
              animeListArr = JSON.parse(Cookies.get('AnimeList'));
              // console.log(animeListArr);
              animeListArr.push(animeID);
              console.log(animeListArr)
              // Cookies.remove('AnimeList');
              Cookies.set('AnimeList', JSON.stringify(animeListArr), {expires: 365 })
            } else {
              var myArr = [animeID];
              Cookies.set('AnimeList', JSON.stringify(myArr), {expires: 365 })

            }
            
            
          }
          function handleError(error) {
            // alert('Error. ' + error);
            console.log(error);
          }
        })
      },
      animeListLoadCookies: function() {
        setTimeout(function() {
          if (Cookies.get('AnimeList') !== undefined ) {
            // console.log('there is a cookie here');
            
            // var animeList = Cookies.get('AnimeList');
  
            var animeListArr = JSON.parse(Cookies.get('AnimeList'));
            // console.log(animeListArr);
  
            for (var i = 0; i < animeListArr.length; i++) {
              // console.log('loading this id from the Cookies: ' + animeListArr[i]);
              
  
              var query = `
              query ($id: Int) { # Define which variables will be used in the query (id)
                Media (id: $id, type: ANIME) { # Insert our variables into the query arguments (id) (type: ANIME is hard-coded in the query)
                  id
                  title {
                    english
                  }
                  streamingEpisodes {
                    title
                    thumbnail
                    url
                    site
                  }
                }
              }
              `;
              var variables = {
                id: animeListArr[i]
              }
    
              var url = 'https://graphql.anilist.co',
              options = {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
                },
                body: JSON.stringify({
                  query: query,
                  variables: variables
                })
              };
              fetch(url, options)
              .then(handleResponse)
              .then(handleData)
              .catch(handleError);
    
              function handleResponse(response) {
                return response.json().then(function (json) {
                  return response.ok ? json : Promise.reject(json);
                });
              }
              function handleData(data) {
                // console.log(data);
                var animeID = data.data.Media.id;
                var animeName = data.data.Media.title.english;
                var newestEpisode = data.data.Media.streamingEpisodes[0].title;
               
                $('<li class="'+animeID+'"><span class="a-name">'+animeName+'</span><span class="a-episode"><span>'+newestEpisode+'</span></span></li>').appendTo($('#anime-list > ul')); 
              }
              function handleError(error) {
                // alert('Error. ' + error);
                console.log(error);
              }
            }
  
          }

        }, 300)
        
      },
      animeListClearAll: function() {
        $('section#main').on('click', 'a#clear-watchlist', function() {
          // console.log('the button has been pushed');
          Cookies.remove('AnimeList');
          $('#anime-list .home-list > li:not(:first-child)').remove();
        })
      },
      animeModal: function() {

        function timeConverter(UNIX_timestamp){
          var a = new Date(UNIX_timestamp * 1000);
          var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
          var year = a.getFullYear();
          var month = months[a.getMonth()];
          var date = a.getDate();
          var hour = a.getHours();
          var min = a.getMinutes();
          var sec = a.getSeconds();
          var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
          return time;
        }

        
        $('section#main').on('click', '#anime-list li[class]', function() {
          const clickedAnimeID = $(this).attr('class');
          // Here we define our query as a multi-line string
          var query = `
          query ($id: Int, $page: Int, $perPage: Int) { 
            Media (id: $id, type: ANIME) {
              id
              description
              updatedAt
              siteUrl
              status(version:2)
              relations{
                edges{
                  id 
                  relationType(version:2)
                  node{
                    id 
                    title{userPreferred}
                    format 
                    type 
                    status(version:2)
                    bannerImage
                    coverImage{
                      large
                    }
                  }
                }
              }
              recommendations(perPage:7,sort:[RATING_DESC,ID]){
                pageInfo{
                  total
                }
                nodes{
                  id 
                  rating 
                  userRating 
                  mediaRecommendation{
                    id 
                    title{
                      userPreferred
                    }
                    format 
                    type 
                    status(version:2)
                    bannerImage 
                    coverImage{
                      large
                    }
                  }
                  user {
                    id 
                    name 
                    avatar{
                      large
                    }
                  }
                }
              }
              reviews(page:$page, perPage: $perPage, sort:[RATING_DESC,ID]){
                pageInfo{
                  total 
                  perPage 
                  currentPage 
                  lastPage 
                  hasNextPage
                }
                nodes{
                  createdAt
                  updatedAt
                  body
                  summary 
                  rating
                  score
                  user{
                    name 
                    avatar{
                      large
                    }
                  }
                }
              }
              trailer {
                site
                thumbnail
                id
              }
              genres
              tags {
                name
                description
              }
              averageScore
              externalLinks {
                url
                site
              }
              title {
                english
                romaji
              }
              coverImage {
                extraLarge
              }
              bannerImage
              nextAiringEpisode {
                airingAt
                timeUntilAiring
                episode
              }
              streamingEpisodes{
                title
                thumbnail
                url
                site
              }
            }
          }
          `;

          // Define our query variables and values that will be used in the query request
          var variables = {
              id: clickedAnimeID,
              page: 1,
              perPage: 15
          };

          // Define the config we'll need for our Api request
          var url = 'https://graphql.anilist.co';
          var options = {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json',
              },
              body: JSON.stringify({
                  query: query,
                  variables: variables
              })
          };

          // Make the HTTP Api request
          fetch(url, options).then(handleResponse)
                            .then(populateModal)
                            .catch(handleError);

          function handleResponse(response) {
              return response.json().then(function (json) {
                  return response.ok ? json : Promise.reject(json);
              });
          }

          function populateModal(data) {
            var theAnime = data.data.Media;
            var allEpisodes = theAnime.streamingEpisodes;
            var allTags = theAnime.tags;
            var allLinks = theAnime.externalLinks;
            var allGenres = theAnime.genres;
            var allReviews = theAnime.reviews;

            console.log(theAnime);


            // populate things
            $('#anime-modal .a-banner-img').css('background-image', 'url("'+ theAnime.bannerImage +'")');
            $('#anime-modal .a-cover-img').css('background-image', 'url("'+ theAnime.coverImage.extraLarge +'")');
            $('#anime-modal .a-user-score').text(theAnime.averageScore);
            $('#anime-modal .a-title').text(theAnime.title.english);
            $('#anime-modal .a-title-romaji').text(theAnime.title.romaji);
            $('#anime-modal .a-description').html(theAnime.description);

            if (theAnime.trailer != null) {
                $(`<li>
                  <div class="embed-container">
                    <iframe src="https://www.youtube.com/embed/${theAnime.trailer.id}" allowfullscreen"></iframe>
                  </div>
                </li>      
              `).appendTo($('#anime-modal ul#a-trailer-list'));
            }

             // genres
             for (i = 0; i < allGenres.length; i++) {
              $(`<li>${allGenres[i]}</li>`).appendTo($('#section-genres ul'));
            }
            // Official links
            for (i = 0; i < allLinks.length; i++) {
              $(`<li>
                  <a href="${allLinks[i].url}" target="_blank" title="${allLinks[i].site}">${allLinks[i].site}</a>
                </li>`).appendTo($('#section-links ul'))
            }
            // tags
            for (i = 0; i < allTags.length; i++) {
              $(`<li data-attr="${allTags[i].description}">${allTags[i].name}</li>`).appendTo($('#section-tags ul'));
            }
            // Unofficial Links
            $(`<li>
                  <a class="link-4anime" href="//4anime.to/?s=` + theAnime.title.romaji.replace(' ', '+') + `" target="_blank"></a>
                </li>
                <li>
                  <a class="link-animedao" href="//animedao.to/search/?search=` + theAnime.title.romaji.replace(' ', '+') + `" target="_blank"></a>
                </li>
                <li>
                  <a class="link-animekisa" href="//animekisa.tv/search?q=` + theAnime.title.romaji.replace(' ', '+') + `" target="_blank"></a>
                </li>
            `).appendTo('#section-ulinks ul');
            
            // episodes
            for (i = 0; i < allEpisodes.length; i++) {
              $(`<li>
                  <div class="image-side" style="background-image:url('${allEpisodes[i].thumbnail}')"></div>
                  <div class="copy-side">
                    <div class="inner-wrapper">
                      <h4>${allEpisodes[i].title}</h4>
                      <ul class="services-list">
                        <li><a href="${allEpisodes[i].url}">${allEpisodes[i].site}</a></li>
                      </ul>
                    </div>
                  </div>
                </li>`).appendTo($('ul#a-episode-list'));
            }

            // reviews
            if (allReviews != null) {
              for (i = 0; i< allReviews.nodes.length; i++) {
                var review = allReviews.nodes[i];
                var updatedAt = review.updatedAt;
                var s = JSON.stringify(updatedAt);
                var d = timeConverter(JSON.parse(s));
                console.log(review.updatedAt);
                $(`
                <li>
                  <div class="profile-side">
                    <div class="r-img" style="background-image: url('${review.user.avatar.large}');"></div>
                    <spans class="r-author">${review.user.name}</span>
                  </div>
                  <div class="review-side">
                    <div class="inner-wrapper">
                      <div class="review-footer">
                        <span class="r-updatedAt">${d}</span>
                      </div>
                    </div>
                  </div>
                </li>
                `).appendTo('ul#a-review-list');
              }
            }
            
            
           
            $('#anime-modal').addClass('active');
          }

          function handleError(error) {
              alert('Error, check console');
              console.error(error);
          }




          

        }) // end of our animeShowAllEpisodes click

        function closeModal() {
          $('#anime-modal').removeClass('active');
          // unpopulate things
          setTimeout(function() {
            $('#anime-modal .a-banner-img, #anime-modal .a-cover-img').css('background-image', '');
            $('#anime-modal .a-user-score, #anime-modal .a-title, #anime-modal .a-title-romaji, #anime-modal .a-description, #anime-modal .main-copy > ul, .info-section > ul').empty();
          }, 500)
        }

        $('section#main').on('click', '#close-modal', function() {
          closeModal();
        });
        $('section#main').on('click', ".content-switcher span:not(.active)", function() {
          var tabName = $(this).attr('data-id');
          $('.modal-inner .main-copy > ul.active, #anime-modal .content-switcher span.active').removeClass('active');
          $('.modal-inner .main-copy > ul[id="'+tabName+'"]').addClass('active');
          $(this).addClass('active');
        })

        // info Section dropdowns
        $('section#main').on('click', '.info-section span', function() {
          $(this).parent('.info-section').toggleClass('active');
        })

      }
    }
    
    // ================================
    // Weather 
    // ================================
  
    WEATHER = {
      init: function() {
        this.registerZip();
        this.pullJson();
        this.unitChange();
      },
      registerZip: function() {
        userZip = Cookies.get('userZip');
        if (userZip == undefined) {
          setTimeout(function() {
            $('#weather-signin').removeClass('hidden');
          }, 1000)
        } else {
          $('#weather-wrapper').addClass('active');
        }

        // register user's zip as cookie var
        function submitZip() {
          if ($('input#userZip').val()) {
            var inputZip = $('input#userZip').val();
            Cookies.set('userZip', inputZip, {
              expires: 365
            });
            // console.log('cookie is now created w zip of ' + inputZip);
            $('#weather-signin').html('<p>Your zip code has been set to<br>' + inputZip + '.</p>');
            setTimeout(function() {
              $('#weather-signin').addClass('hidden');
              $('#weather-wrapper').addClass('active');
            }, 3000);
          }
        }
        $('#weather-signin .btn-submit').on('click', function() {
          submitZip();
        })
        setTimeout(function() {
          $('input#userZip').bind('keypress', function(e) {
            var code = e.keyCode || e.which;
            if(code == 13) {
              submitZip();
            }
          })
        }, 1000)

      },
      pullJson: function() {
        userUnit = Cookies.get('userWeatherUnit');
        if (userUnit == undefined || userUnit == "metric") { 
          // console.log('is default or metric');
          setTimeout(function() {
            var OWM_api = 'd3dbee43ce83080a383c1aae158663ba';
            var userZip = Cookies.get('userZip');
            fetch('//api.openweathermap.org/data/2.5/weather?zip=' + userZip +'&appid='+OWM_api +'&units=metric')
            .then(response => response.json())
            .then(data => {
              var nameValue = data['name'],
              tempValue = data['main']['temp'],
              iconValue = data['weather'][0]['icon'],
              descValue = data['weather'][0]['description'],
              tempRounded = tempValue.toFixed(1);
  
              // console.log(data);
              $('.current-weather .temperature .value').text(tempRounded);
              $('.current-weather .location span').text(nameValue);
              $('.current-weather .right-side .weather-description').text(descValue);
              $('.current-weather .weather-icon').css('background-image', 'url("//openweathermap.org/img/wn/'+iconValue+'.png');
  
              $('#weather-wrapper').addClass('active');
  
            })
            .catch(err => console.log('there is a weather map api error'))
  
          }, 500);

        } else {
          setTimeout(function() {
            var OWM_api = 'd3dbee43ce83080a383c1aae158663ba';
            var userZip = Cookies.get('userZip');
            var userUnit = Cookies.get('userWeatherUnit');
            fetch('//api.openweathermap.org/data/2.5/weather?zip=' + userZip +'&appid='+OWM_api +'&units=' + userUnit)
            .then(response => response.json())
            .then(data => {
              var nameValue = data['name'],
              tempValue = data['main']['temp'],
              iconValue = data['weather'][0]['icon'],
              descValue = data['weather'][0]['description'],
              tempRounded = tempValue.toFixed(1);
  
              // console.log(data);
              $('.current-weather .temperature .value').text(tempRounded);
              $('.unit-selector a.active').removeClass('active');
              $('.unit-selector #imperial').addClass('active');
              $('.left-side .temperature.unit-c').removeClass('unit-c').addClass('unit-f');
              $('.current-weather .location span').text(nameValue);
              $('.current-weather .right-side .weather-description').text(descValue);
              $('.current-weather .weather-icon').css('background-image', 'url("//openweathermap.org/img/wn/'+iconValue+'.png');
  
              $('#weather-wrapper').addClass('active');
  
            })
            .catch(err => console.log('there is a weather map api error'))
  
          }, 500);
        }
        
        
      },
      unitChange: function() {
        $(document).on('click', '.unit-selector a' , function() {
          if (!$(this).hasClass('active')) {
            theUnit = $(this).attr('id');
            var OWM_api = 'd3dbee43ce83080a383c1aae158663ba';
            var userZip = Cookies.get('userZip');
            fetch('//api.openweathermap.org/data/2.5/weather?zip=' + userZip +'&appid='+OWM_api +'&units='+ theUnit )
            .then(response => response.json())
            .then(data => {
              var nameValue = data['name'],
              tempValue = data['main']['temp'],
              iconValue = data['weather'][0]['icon'],
              descValue = data['weather'][0]['description'],
              tempRounded = tempValue.toFixed(1);

              // console.log(data);
              $('.current-weather .temperature .value').text(tempRounded);
              $('.current-weather .location span').text(nameValue);
              $('.current-weather .right-side .weather-description').text(descValue);
              $('.current-weather .weather-icon').css('background-image', 'url("//openweathermap.org/img/wn/'+iconValue+'.png');
            })
            .catch(err => console.log('there is a weather map api error'))
            $('.unit-selector a.active').removeClass('active');
            $(this).addClass('active');

            Cookies.remove('userWeatherUnit');
            Cookies.set('userWeatherUnit', theUnit, {
              expires: 365
            })

            var metricActive = $('.unit-selector #metric.active');

            if (metricActive.length) {
              $('.current-weather .left-side .temperature.unit-f').removeClass('unit-f').addClass('unit-c');
            } else {
              $('.current-weather .left-side .temperature.unit-c').removeClass('unit-c').addClass('unit-f');

            }


          }
          
          return false;
        })
      }
      
    };

     // ================================
    // NEWS 
    // ================================
  
    NEWS = {
      init: function() {
        // this.fetchNews2();
        // this.shuffleNews();
      },
      fetchNews: function() {
        var data = {};
        var url = 'https://newsapi.org/v2/everything?apiKey=fe9023de4c4a433d96fbd01d63178a45';
        options = {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain',
            'Accept': 'application/json'
          },
          body: JSON.stringify(data)
        }
        fetch(url, options, {
          mode: 'no-cors',
          credentials: 'same-origin'

        })
          .then(response => response.json())
          .then(handleData)
          .catch(handleError)
        
    
        function handleData(data) {
          console.log(data);
        }
        function handleError(error) {
          console.log(error);
        }
      
      },
      fetchNews2: function() {
        setTimeout(function() {
          const data = null;
        const xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function () {
          if (this.readyState === this.DONE) {
            // console.log(this.responseText);
            // console.log(JSON.parse(this.responseText));
            var newsJson = JSON.parse(this.responseText);
            for (var i = 0; i < newsJson['articles'].length; i++) {
              var singleArticle = newsJson['articles'][i],
              theName = singleArticle['title'],
              theLink = singleArticle['link'];
              if (singleArticle['media'] == null ) {
                var theIMG = '/css/images/brand/favi.jpg'
              } else {
                var theIMG = singleArticle['media'];
              }
              
              // console.log(theName);
              $('<li><a target="_blank" href="'+theLink+'" style="background-image: url('+theIMG+')"><span>'+theName+'</span></a></li>').appendTo('ul.all-news');
            }

            // shuffle them now. 
            $('ul.all-news li').shuffle();

          }
        });
        xhr.open("GET", "https://newscatcher.p.rapidapi.com/v1/latest_headlines?lang=en&media=True");
        xhr.setRequestHeader("x-rapidapi-key", "92d9452a90msh172394c7b5fafe1p104d05jsna7cdba7833a1");
        xhr.setRequestHeader("x-rapidapi-host", "newscatcher.p.rapidapi.com");
        xhr.send(data);

        }, 1000)
        
      },
      shuffleNews: function() {

      }
      
    };

    // ================================
    // Reddit 
    // ================================
  
    REDDIT = {
      init: function() {
       this.classChanges();
       this.transitionContent();
       this.loadRedditMain();
       this.unhideLogin();
      //  this.checkLoggedIn();
      },
      classChanges: function() {
        $('body').attr('class', 'reddit');
        $('.sidebar-wrapper .sidebar-item.active').removeClass('active');
        $('.sidebar-wrapper .sidebar-item#reddit').addClass('active');
      },
      transitionContent: function() {
       
        $('#home-content').addClass('transitioning');
        setTimeout(function() {
          $('#home-content').removeClass('transitioning')
        }, 1000);
         
       },
      loadRedditMain: function() {
        $('#home-content').load('includes/part-reddit-main.html');
      },
      checkLoggedIn: function() {
    


        // $.ajax({
        //   url: 'https://www.reddit.com/api/v1/access_token',
        //   type: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //     'Authorization': 'Bearer <token>'
        //   },
        //   data: {
        //     grant_type: 'authorization_code',
        //     code: getVar("code"),
        //     redirect_uri: 'https://the-tiggles.github.io/webby'
        //   },
        //   success: function(result) {
        //     // CallBack(result);
        //     console.log('it works!')
        //     console.log(result)
        //   },
        //   eror: function(error) {
        //     console.log(error);
        //   }
        // })

        var data = {
          grant_type: 'authorization_code',
          code: getVar("code"),
          redirect_uri: 'https://the-tiggles.github.io/webby'
        }
        // http.open('POST', url, true);
        // http.setRequestHeader('Content-Type', 'application/json');
        // http.onreadystatechange = function() {
        //   if (http.readyState == 4 && http.status == 200) {
        //     alert(http.responseText);
        //   }
        // }
        // http.send(params);


        // $.post(url, data, function(data, status) {
        //   console.log(`${data} and ${status}`)
        // })

        // var r = new snoowrap({
        //   userAgent: 'A unique browser experience with anime and reddit',
        //   clientId: 'cQLY-btbx4lhmw',
        //   // clientSecret: '	L_FuRr8vbwbXi0QBeqMluCPK9MFu1Q',
        //   refreshToken: ''
        // });

        function createAuth1() {
          var authenticationUrl = snoowrap.getAuthUrl({
            clientId: 'cQLY-btbx4lhmw',
            scope: ['identity', 'subscribe', 'history', 'account', 'submit', 'save', 'report', 'read', 'edit', 'vote', 'mysubreddits'],
            redirectUri: 'https://the-tiggles.github.io/webby',
            permanent: true,
            state: '03141990'
          })
          window.location.href = authenticationUrl;
        }


        function createInstance(accessToken) {
          return new snoowrap({
            userAgent: "Web App",
            clientId: 'cQLY-btbx4lhmw',
            clientSecret: "",
            accessToken: accessToken
          })
        }
        var instance = createInstance(code);
        try {
          // console.log(await instance.getHot())
        } catch(e) {
          console.log(JSON.stringify(e, null, 2))
        }


        var code = new URL(window.location.href).searchParams.get('code');

        snoowrap.fromAuthCode({
          code: code,
          userAgent: 'User-Agent: web:https://the-tiggles.github.io/webby:v1 (by /u/tiggaaaaah)',
          clientId: 'cQLY-btbx4lhmw',
          redirectUri: 'https://the-tiggles.github.io/webby'
        }).then( r=> {
          return r.getHot().then(posts=> {
            console.log('it worked, here are the posts');
            console.log(posts);
          })
        })



        r.getSubscriptions({limit: 5}).then(console.log);



      },
      unhideLogin() {
        setTimeout(function() {
          $('#reddit-login').removeClass('hidden');
        }, 500)
      }
    };
  
    // ================================
    // Default template
    // ================================
  
    DEFAULT = {
      init: function() {
       
      },
      
    };
  
    // ================================
    // Sitemap
    // ================================
  
    SITEMAP = {
      init: function() {
        
      },
    };
  
    // ================================
    // 404
    // ================================
  
    PAGE_404 = {
      init: function() {
        
      },
    };
  
    // Initialize
    INIT.init();
  
  }); // end doc ready
  
  
  
  
  