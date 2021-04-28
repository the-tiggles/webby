/* _helper.js */

$(document).ready(function() {
    // var jQuery = $;
  
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
        isReddit = $('body.reddit').length,
        isSitemap = $('div.sitemap').length,
        is404 = $('body > form.http-404').length;
  
  
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
        if (isHome) { HOME.init(); ANIME.init(); }
        if (isReddit) {REDDIT.init();}
        if (isDefault) { DEFAULT.init(); }
        if (isSitemap) { SITEMAP.init(); }
        if (is404) { PAGE_404.init(); }
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
          NEWS.init();
        });
        $('#sidebar').on('click', '.sidebar-item#reddit', function() {
          REDDIT.init();
        })
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
        this.animeShowAllEpisodes();
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
          console.log('the button has been pushed');
          Cookies.remove('AnimeList');
          $('#anime-list .home-list > li:not(:first-child)').remove();
        })
      },
      animeShowAllEpisodes: function() {
        $('section#main').on('click', '#anime-list li[class]', function() {
          const clickedAnimeID = $(this).attr('class');
          // Here we define our query as a multi-line string
          // Storing it in a separate .graphql/.gql file is also possible
          var query = `
          query ($id: Int) { 
            Page (page: $page, perPage: $perPage) {
              pageInfo {
                total
                currentPage
                lastPage
                hasNextPage
                perPage
              }
              Media (id: $id, type: ANIME) {
                id
                description
                updatedAt
                siteUrl
                status
                relations {
                  adaptation
                  prequel
                  sequel
                  parent
                  side_story
                  character
                  spin_off
                }
                reviews {
                  id
                  body
                  rating
                  ratingAmount
                  userRating
                  createdAt
                  user
                  summary
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
                streamingEpisodes {
                  title
                  thumbnail
                  url
                  site
                }
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
          var url = 'https://graphql.anilist.co',
              options = {
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
            var theAnime = data.data;
            var allEpisodes = data.data.Media.streamingEpisodes;
            var allTags = data.data.Media.tags;
            var allLinks = data.data.Media.externalLinks;
            var allGenres = data.data.Media.genres;

            console.log(theAnime);


            // populate things
            $('#anime-modal .a-banner-img').css('background-image', 'url("'+ theAnime.Media.bannerImage +'")');
            $('#anime-modal .a-cover-img').css('background-image', 'url("'+ theAnime.Media.coverImage.extraLarge +'")');
            $('#anime-modal .a-user-score').text(theAnime.Media.averageScore);
            $('#anime-modal .a-title').text(theAnime.Media.title.english);
            $('#anime-modal .a-title-romaji').text(theAnime.Media.title.romaji);
            $('#anime-modal .a-description').html(theAnime.Media.description);


            // episodes
            for (i = 0; i < allEpisodes.length; i++) {
              $(`<li>
                  <div class="image-side" style="background-image:url('${allEpisodes[i].thumbnail}')"></div>
                  <div class="copy-side">
                    <div class="inner-wrapper">
                      <h4>${allEpisodes[i].title}</h4>
                      <p>Streaming:</p>
                      <ul class="services-list">
                        <li><a href="${allEpisodes[i].url}">${allEpisodes[i].site}</a></li>
                      </ul>
                    </div>
                  </div>
                </li>`).appendTo($('ul#a-modal-list'));
              
            }
            // external links
            for (i = 0; i < allLinks.length; i++) {
              $(`<li>
                  <a href="${allLinks[i].url}" target="_blank" title="${allLinks[i].site}">${allLinks[i].site}</a>
                </li>`).appendTo($('#section-links ul'))
            }
            // tags
            for (i = 0; i < allTags.length; i++) {
              $(`<li data-attr="${allTags[i].description}">${allTags[i].name}</li>`).appendTo($('#section-tags ul'));
            }
            // genres
            for (i = 0; i < allGenres.length; i++) {
              $(`<li>${allGenres[i]}</li>`).appendTo($('#section-genres ul'));
            }
            $('#anime-modal').addClass('active');
          }

          function handleError(error) {
              alert('Error, check console');
              console.error(error);
          }

        }) // end of our animeShowAllEpisodes click




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
          if ($('input#userZip').val().length) {
            var inputZip = $('input#userZip').val();
            Cookies.set('userZip', inputZip, {
              expires: 365
            });
            console.log('cookie is now created w zip of ' + inputZip);
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
  
              console.log(data);
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

              console.log(data);
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
       this.checkLoggedIn();
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
      checkLoggedIn() {
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
  
  
  
  
  