// ==UserScript==
// @name        FilterProperties
// @namespace   ltw
// @include     https://www.google.com/webmasters/tools/home?hl=de*
// @version     1
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_addStyle
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// ==/UserScript==

$(document).ready(function() {
    setTimeout(init,2000);
    //init();
});
var init = function () {
    var $body = $('body');
    if (!$body.hasClass("wmt") || $body.hasClass('ltw-init')) {
        return;
    }
    $body.addClass('ltw-init');
    console.log("Initialization in progress");
    GM_addStyle('.ltw-hide {display:none;} #ltw-navigation-bar  a {float:right; margin:10px;}');




    $('#main-content').prepend("<div id='ltw-bars'><div id='ltw-navigation-bar'><a id='ltw-filter-settings-link'>Settings</a><input type='checkbox' checked='checked' id='ltw-filter-checkbox'>Filter</div><div id='ltw-filter-settings-div' class='ltw-hide'><form action='https://www.paypal.com/cgi-bin/webscr' method='post' target='_top'><input type='hidden' name='cmd' value='_s-xclick'><input type='hidden' name='hosted_button_id' value='WXW7AXFBQPWUL'><input type='image' src='https://www.paypalobjects.com/de_DE/DE/i/btn/btn_donate_SM.gif' border='0' name='submit' alt='Jetzt einfach, schnell und sicher online bezahlen – mit PayPal.'><img alt='' border='0' src='https://www.paypalobjects.com/de_DE/i/scr/pixel.gif' width='1' height='1'></form><ul></ul></div></div>");
    var $settingsDiv = $('#ltw-filter-settings-div');
    var $ul = $settingsDiv.find('ul');
    var $websites = $('.site-verified');
    var settings = GM_getValue('ltwHidePropertiesSettings',[]);
    $websites.each(function() {
        var str = "<li><input class='ltw-checkbox' type='checkbox' value='";
        $ul.append(str.concat(this.text,"' ",(settings.indexOf(this.text)!==-1) ? " checked='checked'" : "","> ",this.text,"</li>"));
    });
    var $filterCheckbox = $('#ltw-filter-checkbox');
    $('#ltw-filter-settings-link').click(function() {
        $settingsDiv.toggleClass('ltw-hide');
    });
    $('#ltw-filter-checkbox').change(doTheMagic);
    $('.ltw-checkbox').change(function() {
        // update the settings
        $('.ltw-checkbox').each(function() {
           var checked = $(this).is(':checked');
            console.log(this.value);
            if (checked && settings.indexOf(this.value) === -1) {
                settings.push(this.value);
            } else if(!checked) {
                var position = $.inArray(this.value,settings);
                if (~position) settings.splice(position,1);
            }
        });
        GM_setValue('ltwHidePropertiesSettings',settings);

        doTheMagic();
    });
    doTheMagic();
};
var doTheMagic = function() {
    var hide = ($('#ltw-filter-checkbox').is(':checked'));
    var $websites = $('.site-verified');
    var settings = GM_getValue('ltwHidePropertiesSettings',[]);
    $websites.each(function() {
        if (hide && settings.indexOf(this.text)!== -1) {
            $(this).closest('table').closest('div').addClass('ltw-hide');
        } else {
            $(this).closest('table').closest('div').removeClass('ltw-hide');
        }
    });
};
