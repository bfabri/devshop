$(function() {

    function Cart() {
        return {
            load: function() {
                $.get('http://localhost:3000/cart', function(developers) {
                    for (var i = 0; i < developers.length; i++) {
                        var developer = developers[i];

                        var $tr = $('<tr class="product" />');
                        $tr.append($('<td />').html(developer.name));
                        $tr.append($('<td />').html('$' + developer.price));
                        $tr.append($('<td />').append($('<button class="btn btn-danger pull-right />').html('Remove')));
                        $('table.table.cart tbody').append($tr);
                    }
                });
            },

            clear: function() {
                $('table.table.cart tbody').clear();
            }
        }
    }
    
});
