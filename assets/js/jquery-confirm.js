(function($){

    $.confirm = function(params){

        if($('.modal').length){
            // A confirm is already shown on the page:
            return false;
        }

        var buttonHTML = '';
        $.each(params.buttons,function(name,obj){

            // Generating the markup for the buttons:

            buttonHTML += '<button class="'+obj['class']+'">'+name+'</button>';

            if(!obj.action){
                obj.action = function(){};
            }
        });

        var markup = [
            '<div class="modal">',
            '<div class="box">',
            params.message,
            '<div class="buttons">',
            buttonHTML,
            '</div></div></div>'
        ].join('');

        $(markup).hide().appendTo('body').fadeIn();

        var buttons = $('.modal .box .buttons button'),
            i = 0;

        $.each(params.buttons,function(name,obj){
            buttons.eq(i++).click(function(){

                // Calling the action attribute when a
                // click occurs, and hiding the confirm.

                obj.action();
                $.confirm.hide();
                return false;
            });
        });
    }

    $.confirm.hide = function(){
        $('.modal').fadeOut(function(){
            $(this).remove();
        });
    }

})(jQuery);