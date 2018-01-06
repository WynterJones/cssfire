$(document).ready(function() {

  // Ace Editors
  var editor = ace.edit("editor");
  theme = localStorage.getItem('theme');
  if (theme == "") {
    theme = "ace/theme/clouds";
  }
  editor.setTheme(theme);
  editor.getSession().setMode("ace/mode/html");
  editor.getSession().setUseWrapMode(false);

  var newHTMLEditor = ace.edit("newHTMLEditor");
  newHTMLEditor.setTheme(theme);
  newHTMLEditor.getSession().setMode("ace/mode/html");
  newHTMLEditor.getSession().setUseWrapMode(false);

  var cssClassesEditor = ace.edit("cssClassesEditor");
  cssClassesEditor.setTheme(theme);
  cssClassesEditor.getSession().setMode("ace/mode/css");
  cssClassesEditor.getSession().setUseWrapMode(false);

$('#aceTheme option').prop('selected', false)
                   .filter('[value="'+theme+'"]')
                   .prop('selected', true);
  $('#cleanBox').fadeOut(1000);

  // Clean Up HTML ------------------
  $('#cleanNow').click(function() {

    // Prepend Overwrite
    prepend = $('#prependID').val();
    if (prepend == "") {
      prepend = "cssFire";
    }

    // Add HTML Tags
    htmlTags = "";
    if ($('#addTag').is(':checked')) {
      htmlTags = "checked";
    }

     // Add HTML IDs
    addID = "";
    if ($('#addID').is(':checked')) {
      addID = "checked";
    }

    // Setup to Clean
    oldHTML = editor.getValue();
    $('#iframe').contents().find("body").html(oldHTML);
    i = 0;
    $('#cssClassesPrepare').html("");

    // Parse HTML for Styles
    var total =  $( "#iframe" ).contents().find("[style]").length;
    $( "#iframe" ).contents().find("[style]").each(function(index) {

        i = i +1;

        // Check for HTML Tag Name
        tag = $(this).prop("tagName").toLowerCase();
        if (htmlTags == "checked") {
            cssClass = prepend+i+'_'+tag;
        }
        else {
            cssClass = prepend+i;
        }

        // Check for HTML ID Name
        if ($(this).attr('id')) {
          html_id = $(this).attr('id');
        }
        else {
          html_id = "";
        }
        if (addID == "checked" && html_id != "") {
           
            if (htmlTags == "checked") {
                 cssClass = prepend+i+'_'+html_id+'_'+tag;
            }
            else {
                 cssClass = prepend+i+'_'+html_id;
            }
        }
        else {
            if (htmlTags == "checked") {
                cssClass = prepend+i+'_'+tag;
            }
            else {
                cssClass = prepend+i;
            }
        }

        // Clean CSS
        $(this).addClass(cssClass);
        styles = $(this).attr('style');

        // If Last Style
        if (index === total - 1) {
         if ($('#minify').is(':checked')) {
            styles = styles.replace(/ {2,}/g, ' ');
            minifyCSS = styles.split('; ').join(';');
            minifyCSS = minifyCSS.split(';').join(';');
            finalCSS = '.'+cssClass+' { ' + minifyCSS + ' }\n';
            $(this).removeAttr( "style" );
            finalCSS = finalCSS.replace(/^\s*\n/gm, "");
            finalCSS = finalCSS.trim();
            $('#cssClassesPrepare').append(finalCSS);
            getCSS = $('#cssClassesPrepare').html();
            cssClassesEditor.setValue(getCSS, 1);
        }
        else {
            styles = styles.replace(/ {2,}/g, ' ');
            prettyCSS = styles.split('; ').join(';');
            prettyCSS = prettyCSS.split(';').join(';\n\t');
            finalCSS = '.'+cssClass+' { \n\t' + prettyCSS + '\n}\n';
            $(this).removeAttr( "style" );
            finalCSS = finalCSS.replace(/^\s*\n/gm, "");
            finalCSS = finalCSS.trim();
            $('#cssClassesPrepare').append(finalCSS);
            getCSS = $('#cssClassesPrepare').html();
            cssClassesEditor.setValue(getCSS, 1);
        }
    }
    // If NOT Last Style
    else {
       if ($('#minify').is(':checked')) {
            styles = styles.replace(/ {2,}/g, ' ');
            minifyCSS = styles.split('; ').join(';');
            minifyCSS = minifyCSS.split(';').join(';');
            finalCSS = '.'+cssClass+' { ' + minifyCSS + ' }\n';
            $(this).removeAttr( "style" );
            finalCSS = finalCSS.replace(/^\s*\n/gm, "");
            finalCSS = finalCSS.trim();
            finalCSS = finalCSS.replace("}", "}\n");
            $('#cssClassesPrepare').append(finalCSS);
            getCSS = $('#cssClassesPrepare').html();
            cssClassesEditor.setValue(getCSS, 1);
        }
        else {
            styles = styles.replace(/ {2,}/g, ' ');
            prettyCSS = styles.split('; ').join(';');
            prettyCSS = prettyCSS.split(';').join(';\n\t');
            finalCSS = '.'+cssClass+' { \n\t' + prettyCSS + '\n}\n';
            $(this).removeAttr( "style" );
            finalCSS = finalCSS.replace(/^\s*\n/gm, "");
            finalCSS = finalCSS.trim();
            finalCSS = finalCSS.replace("}", "}\n");
            $('#cssClassesPrepare').append(finalCSS);
            getCSS = $('#cssClassesPrepare').html();
            cssClassesEditor.setValue(getCSS, 1);
        }
    }

    }); // End Clean Click
function unescapeHTML(escapedHTML) {
  return escapedHTML.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
}
    // Show HTML
    html = $('#iframe').contents().find("body").html();
    html = html.trim();
    newHTMLEditor.setValue(unescapeHTML(html), 1);

    // Fire and Show Results
    $('#fire').attr('style', $('#fire').attr('style') + '; margin-left: 0');
    $('#fire').velocity({opacity: '1'}, 100);
    setTimeout(function() {
      $('#startBox').hide();
      $('#startBox').velocity({opacity: '1'}, 100);
      $('#fire').fadeOut();
      $('.fa-refresh').fadeIn();
      $('#cleanBox').attr('style', 'margin-top: 0');
      $('#cleanBox').fadeIn();
    }, 200);
  });

  // Close Window
  $('#closeWindow').click(function() {
     var gui = require('nw.gui') , win = gui.Window.get();
    win.close();
  });

  // Restart
  $('#restart').click(function() {
    $('#fire').attr('style', $('#fire').attr('style') + '; margin-left: -800px');
    $('#fire').show(); $('#fire').velocity({opacity: '0'}, 100);
    $('#startBox').fadeIn();
    $('.fa-refresh').hide();
    $('#cleanBox').hide();
    $('#cleanBox').attr('style', 'margin-top: 50px');
  });

  $('#aceTheme').change(function() {
    theme = $(this).val();
    localStorage.setItem('theme', theme);
    editor.setTheme(theme);
    newHTMLEditor.setTheme(theme);
    cssClassesEditor.setTheme(theme);
  });

});