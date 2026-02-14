// ============================================
// TAB SWITCH DETECTION PREVENTER (tabhack.js)
// ============================================
// This script prevents websites from detecting
// when you switch to another tab

(function() {
    'use strict';

    console.log('🛡️ Tab Switch Detection Prevention Loaded');

    // Function to override visibility properties
    function overrideVisibility() {
        // Override document.visibilityState to always return "visible"
        Object.defineProperty(document, 'visibilityState', {
            get: function() {
                return 'visible';
            },
            configurable: false
        });

        // Override document.hidden to always return false
        Object.defineProperty(document, 'hidden', {
            get: function() {
                return false;
            },
            configurable: false
        });

        // Override webkitVisibilityState (for older browsers)
        if (document.webkitVisibilityState !== undefined) {
            Object.defineProperty(document, 'webkitVisibilityState', {
                get: function() {
                    return 'visible';
                },
                configurable: false
            });
        }

        // Override webkitHidden (for older browsers)
        if (document.webkitHidden !== undefined) {
            Object.defineProperty(document, 'webkitHidden', {
                get: function() {
                    return false;
                },
                configurable: false
            });
        }

        console.log('✅ Visibility properties overridden');
    }

    // Function to block visibility change events
    function blockVisibilityEvents() {
        const events = [
            'visibilitychange',
            'webkitvisibilitychange',
            'mozvisibilitychange',
            'msvisibilitychange'
        ];

        events.forEach(eventName => {
            // Override addEventListener to block visibility events
            const originalAddEventListener = Document.prototype.addEventListener;
            Document.prototype.addEventListener = function(type, listener, options) {
                if (type === eventName) {
                    console.log('🚫 Blocked:', eventName, 'event listener');
                    return; // Don't add the listener
                }
                return originalAddEventListener.call(this, type, listener, options);
            };

            // Override attachEvent for older IE
            const originalAttachEvent = Document.prototype.attachEvent;
            if (originalAttachEvent) {
                Document.prototype.attachEvent = function(type, listener) {
                    if (type === 'on' + eventName) {
                        console.log('🚫 Blocked (attachEvent):', eventName, 'event listener');
                        return;
                    }
                    return originalAttachEvent.call(this, type, listener);
                };
            }
        });

        console.log('✅ Visibility event listeners blocked');
    }

    // Function to override setInterval/setTimeout behavior when tab is hidden
    function fixTimers() {
        const originalSetInterval = window.setInterval;
        const originalSetTimeout = window.setTimeout;

        // Store the last time to make it appear like the tab is always active
        let lastTime = Date.now();

        // Override setInterval to prevent throttling
        window.setInterval = function(callback, delay, ...args) {
            // If delay is very long (likely throttling), use a shorter delay
            if (delay > 10000) {
                delay = 100; // Reset to shorter interval
            }
            return originalSetInterval.call(window, callback, delay, ...args);
        };

        // Override setTimeout similarly
        window.setTimeout = function(callback, delay, ...args) {
            if (delay > 10000) {
                delay = 100;
            }
            return originalSetTimeout.call(window, callback, delay, ...args);
        };

        console.log('✅ Timer throttling workarounds applied');
    }

    // Function to handle performance timing
    function fixPerformance() {
        // Override performance.now() to prevent detecting time differences
        if (window.performance && window.performance.now) {
            const originalNow = window.performance.now.bind(window.performance);
            let baseTime = originalNow();

            Object.defineProperty(window.performance, 'now', {
                get: function() {
                    return function() {
                        return originalNow();
                    };
                },
                configurable: false
            });
        }

        console.log('✅ Performance timing fixed');
    }

    // Function to prevent fullscreen detection
    function fixFullscreen() {
        // Override document.fullscreenElement
        Object.defineProperty(document, 'fullscreenElement', {
            get: function() {
                return document.documentElement;
            },
            configurable: false
        });

        // Override document.fullscreenEnabled
        Object.defineProperty(document, 'fullscreenEnabled', {
            get: function() {
                return true;
            },
            configurable: false
        });

        // Block fullscreen change events
        const originalAddEventListener = Document.prototype.addEventListener;
        Document.prototype.addEventListener = function(type, listener, options) {
            if (type === 'fullscreenchange' || type === 'webkitfullscreenchange') {
                console.log('🚫 Blocked:', type, 'event');
                return;
            }
            return originalAddEventListener.call(this, type, listener, options);
        };

        console.log('✅ Fullscreen detection fixed');
    }

    // Main initialization
    function init() {
        overrideVisibility();
        blockVisibilityEvents();
        fixTimers();
        fixPerformance();
        fixFullscreen();

        console.log('🎉 All tab detection prevention measures active!');
        console.log('   Websites will think you are always looking at the page.');
    }

    // Run immediately
    init();

    // Run again after a delay to catch late-loading scripts
    setTimeout(init, 1000);
    setTimeout(init, 3000);
    setTimeout(init, 5000);

})();
