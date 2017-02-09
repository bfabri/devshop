$(function() {
    function loadCart() {
        $('table.cart tbody').empty();
        $('table.cart tbody').append($('<img class="loader" src="img/ajax-loader.gif" />'));

         $.get('http://localhost:3000/cart/developers', function(developers) {
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

        var endpointUrl = 'http://localhost:3000/developers';
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
                $tr.append($('<td />').append($('<button class="btn btn-success pull-right add" />').html('Add').attr('data-name', developer.name).attr('data-price', developer.price)));
                $('table.developers tbody').append($tr);
            }

            $('table.developers tbody img.loader').detach();
        });
    }

    $(document).on('click', 'button.delete', function() {
        var id = $(this).attr('data-id');
        
        $.ajax({
            url: 'http://localhost:3000/cart/developer/' + id,
            type: 'DELETE',
            success: function() {
                loadCart();
            }
        });
    });

    $(document).on('click', 'button.add', function() {
        var name = $(this).attr('data-name');
        var price = $(this).attr('data-price');

        $.post('http://localhost:3000/cart/developer', {'name': name, 'price': price}, function() {
            loadCart();
        });
    });

   $(document).on('click', 'button.search', function(event) {
        event.preventDefault();
        loadDevelopers();
    })

    loadDevelopers();
    loadCart();
});
