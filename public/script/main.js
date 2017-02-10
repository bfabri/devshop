$(function() {
    function loadCart() {
        $('table.cart tbody').empty();
        $('table.cart tbody').append($('<img class="loader" src="img/ajax-loader.gif" />'));

         $.get(baseUrl + '/cart/developers', function(developers) {
            $('table.cart tbody').empty();

            var total = 0;
            for (var i = 0; i < developers.length; i++) {
                var developer = developers[i];
                total += developer.price;

                var $tr = $('<tr class="product" />');
                $tr.append($('<td />').html(developer.name));
                $tr.append($('<td />').html('$' + developer.price));
                $tr.append($('<td />').append($('<button class="btn btn-danger pull-right delete" />').html('Remove').attr('data-id', developer.id)));
                $('table.cart tbody').append($tr);
            }

            var $trTotal = $('<tr class="total" />');
            $trTotal.append($('<td />').html('Total'));
            $trTotal.append($('<td />').html('$' + total));
            $('div.totalizer table tbody').empty().append($trTotal);

            $('table.cart tbody img.loader').detach();
        });
    }

    function loadDevelopers() {
        $('table.developers tbody').empty();
        $('table.developers tbody').append($('<img class="loader" src="img/ajax-loader.gif" />'));

        var endpointUrl = baseUrl + '/developers';
        var organization = $('#organization').val();
        if (organization) {
            endpointUrl += '?org=' + organization;
        }

        $.get(endpointUrl, function(developers) {
            for (var i = 0; i < developers.length; i++) {
                var developer = developers[i];

                var $tr = $('<tr class="developer" />');
                $tr.append($('<td />').append($('<img class="img-responsive img-thumbnail" height="50px" width="50px" />').attr('src', developer.avatar_url)));
                $tr.append($('<td />').html(developer.name));
                $tr.append($('<td />').html('$' + developer.price));
                $tr.append($('<td />').append($('<button class="btn btn-success pull-right add" />').html('Add').attr('data-id', developer.id).attr('data-name', developer.name).attr('data-price', developer.price)));
                $('table.developers tbody').append($tr);
            }

            $('table.developers tbody img.loader').detach();
        });
    }

    $(document).on('click', 'button.delete', function() {
        var id = $(this).attr('data-id');
        
        $.ajax({
            url: baseUrl + '/cart/developer/' + id,
            type: 'DELETE',
            success: function() {
                loadCart();
            }
        });
    });

    $(document).on('click', 'button.add', function() {
        $('table.developers tbody tr').removeClass('danger').removeClass('success').removeClass('pointer').popover('destroy');

        var id = $(this).attr('data-id');
        var name = $(this).attr('data-name');
        var price = $(this).attr('data-price');

        var $tr = $(this).parent().parent();

        $.post(baseUrl + '/cart/developer', {'id': id, 'name': name, 'price': price}, function(data) {
            $tr.addClass('success').addClass('pointer');
            $tr.popover({
                title: 'Success!',
                html: true,
                content: 'The developer <b>' + name + '</b> was successfully added to the cart.',
                placement: 'top'
            });

            loadCart();
        }).fail(function(jqXHR){
            var data = jqXHR.responseJSON;
            
            var popoverContent = '<ul>';
            for (var i = 0; i < data.length; i++) {
                popoverContent += '<li>' + data[i].msg + '</li>';
            }
            popoverContent += '</ul>';
            
            $tr.addClass('danger').addClass('pointer');
            $tr.popover({
                title: 'Opps...',
                html: true,
                content: popoverContent,
                placement: 'top'
            });
        });
    });

   $(document).on('click', 'button.search', function(event) {
        event.preventDefault();
        loadDevelopers();
    })

    loadDevelopers();
    loadCart();
});
