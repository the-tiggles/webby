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
        BACKGROUND_IMAGE = BACKGROUND_IMAGE || {},
        VIDEO_EMBED = VIDEO_EMBED || {},
        SMOOTH_SCROLL = SMOOTH_SCROLL || {},
        
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
        BACKGROUND_IMAGE.init();
        VIDEO_EMBED.init();
        SMOOTH_SCROLL.init();
        
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
      },
      loadIt: function() {
          $.ajaxSetup ({
              cache: false
          });
          $('#sidebar').load('includes/sidebar.html');
      }
  
     
    };

    // ================================
    // Sitewide
    // ================================
  
    SITEWIDE = {
      init: function() {
        this.loadGoogleSearch();
      },
      loadGoogleSearch: function() {
          $.ajaxSetup ({
              cache: false
          });
          $('#google-search').load('includes/part-search-google.html');
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
    // Background Image JS
    // ================================
  
    BACKGROUND_IMAGE = {
      init: function() {

      },
  
      
    };
  
    // ================================
    // Iframe Video Embeds
    // ================================
  
    VIDEO_EMBED = {
      init: function() {
      },
  
    };
  
    // ================================
    // Smooth scrolling anchors
    // ================================
  
    SMOOTH_SCROLL = {
      init: function() {
      },
  
    };
  
    // ================================
    // Homepage
    // ================================
  
    HOME = {
      init: function() {
  
      },
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
  
  
  
  
  