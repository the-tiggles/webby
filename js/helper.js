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
        DEFAULT = DEFAULT || {},
        SITEMAP = SITEMAP || {},
        PAGE_404 = PAGE_404 || {};
  
    var isHome = $('body.home').length,
        isDefault = $('body.default').length,
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
        
        // Initialize Page Template Objects
        if (isHome) { HOME.init(); }
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
        this.loadUtility();
      },
      loadGoogleSearch: function() {
          $.ajaxSetup ({
              cache: false
          });
          $('#google-search').load('includes/part-search-google.html');
      },
      loadUtility: function() {
        if ($('body.home').length) {
          $('#utility-bar').load('includes/utility-home.html');
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
        this.homeUtility();
        this.searchStyling();
        this.weatherWidget();
  
      },
      homeUtility: function() {

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
      weatherWidget: function() {
        var OWM_api = 'd3dbee43ce83080a383c1aae158663ba',
        userZip = Cookies.get('userZip');
        if (userZip == undefined) {
          console.log('no such cookie exists');
          setTimeout(function() {
            $('#weather-signin').removeClass('hidden');
          }, 1000)
        }

        // register user's zip as cookie var
        function submitZip() {
          if ($('input#userZip').val().length) {
            var inputZip = $('input#userZip').val();
            Cookies.set('userZip', inputZip);
            console.log('cookie is now created w zip of ' + inputZip);
          }
        }

        $(document).on('keydown', function(event) {
          if (event.key == 13 && $('#userZip').is(':focus')) {
            submitZip();
          }
        })
        $('#weather-signin .btn-submit').on('click', function() {
          submitZip();
        })



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
  
  
  
  
  