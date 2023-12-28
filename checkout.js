document.addEventListener('DOMContentLoaded', function () {

    const orderSummary = document.getElementById('orderSummary');
    const completeOrderButton = document.getElementById('completeOrderButton');
    const goBackButton = document.getElementById('goBackButton');
    const cardNumberInput = document.getElementById('cardNumber');
    const expiryDateInput = document.getElementById('expiryDate');
    const cvvInput = document.getElementById('cvv');

    const storedOrders = localStorage.getItem('coffeeShopOrders');
    const orders = storedOrders ? JSON.parse(storedOrders) : [];


    displayOrderSummary();

 
    completeOrderButton.addEventListener('click', function () {
        if (validateForm()) {
           
            Swal.fire('Order Completed', 'Thank you for your purchase!', 'success');

            localStorage.removeItem('coffeeShopOrders');
            window.location.href = 'index.html';
        }
    });


    goBackButton.addEventListener('click', function () {
     
        window.location.href = 'index.html';
    });

 
    function displayOrderSummary() {
        orderSummary.innerHTML = '';

        if (orders.length === 0) {
            orderSummary.innerHTML = '<p>No items in the order.</p>';
            completeOrderButton.disabled = true;
        } else {
            orders.forEach((order, index) => {
                const orderText = `${order.quantity} ${order.coffeeType}(s) - $${order.totalPrice.toFixed(2)}`;

                const orderItem = document.createElement('div');
                orderItem.appendChild(document.createTextNode(orderText));
                orderSummary.appendChild(orderItem);
            });

            completeOrderButton.disabled = false;
        }
    }

    function validateForm() {
        const cardNumber = cardNumberInput.value.trim();
        const expiryDate = expiryDateInput.value.trim();
        const cvv = cvvInput.value.trim();
    
        // La tarjeta tiene que tener 16 numeros
        const cardNumberPattern = /^\d{16}$/;
    
        // El patron de caducidad deberia coincidir con MM/AAAA
        const expiryDatePattern = /^(0[1-9]|1[0-2])\/\d{4}$/;
    
        // CVV deberia ser un numero de 3 a 4 digitos
        const cvvPattern = /^\d{3,4}$/;
    
        // Valida numero de la tarjeta
        if (!cardNumberPattern.test(cardNumber)) {
            Toastify({
                text: 'Porfavor ingresa un numero de tarjeta valido.',
                duration: 3000,
                gravity: 'top',
                position: 'right',
            }).showToast();
            return false;
        }
    
        // Valida la fecha de caducidad de la tarjeta
        if (!expiryDatePattern.test(expiryDate)) {
            Toastify({
                text: 'Porfavor ingrsa una fecha de caducidad valida. (MM/AAAA).',
                duration: 3000,
                gravity: 'top',
                position: 'right',
            }).showToast();
            return false;
        }
        // valida el CVV
        if (!cvvPattern.test(cvv)) {
            Toastify({
                text: 'Porfavor ingrese un CVV valido.',
                duration: 3000,
                gravity: 'top',
                position: 'right',
            }).showToast();
            return false;
        }
    
    // todas las validaciones aprobadas
        return true;
    }

});
