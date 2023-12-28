document.addEventListener('DOMContentLoaded', function () {
    const coffeeTypeSelect = document.getElementById('coffeeType');
    const quantityInput = document.getElementById('quantity');
    const orderButton = document.getElementById('orderButton');
    const clearCartButton = document.getElementById('clearCartButton');
    const orderResult = document.getElementById('orderResult');
    const totalDisplay = document.getElementById('totalDisplay');
    const checkoutButton = document.getElementById('checkoutButton');
    let orders = [];
    let coffeePrices;

    // Fetch tipos de cafe y precios del archivo JSON
    fetch('./tiposDeCafe.json')
        .then(response => response.json())
        .then(data => {
            coffeePrices = data.coffeeTypes;
            const storedOrders = localStorage.getItem('coffeeShopOrders');
            if (storedOrders) {
                orders = JSON.parse(storedOrders);
                updateOrderResult();
                updateTotalDisplay();
            }
        })
        .catch(error => {
            console.error('Error con el fetch de tipos de cafe', error);
        });

    orderButton.addEventListener('click', function () {
        const coffeeType = coffeeTypeSelect.value;
        const quantity = parseInt(quantityInput.value);

        if (coffeePrices && coffeeType && !isNaN(quantity) && quantity > 0) {
            const existingOrderIndex = orders.findIndex(order => order.coffeeType === coffeeType);

            if (existingOrderIndex !== -1) {
                orders[existingOrderIndex].quantity += quantity;
                orders[existingOrderIndex].totalPrice = calculateTotalPrice(coffeeType, orders[existingOrderIndex].quantity);
            } else {
                const totalPrice = calculateTotalPrice(coffeeType, quantity);
                const orderDetails = { coffeeType, quantity, totalPrice };
                orders.push(orderDetails);
            }

            updateOrderResult();
            updateTotalDisplay();
            localStorage.setItem('coffeeShopOrders', JSON.stringify(orders));

            coffeeTypeSelect.value = 'espresso';
            quantityInput.value = 1;
        } else {
            Swal.fire('Error', 'Por favor, seleccione un tipo de café y cantidad válida.', 'error');
        }
    });

    clearCartButton.addEventListener('click', function () {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción eliminará todos los elementos del carrito.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4caf50',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                orders = [];
                updateOrderResult();
                updateTotalDisplay();
                localStorage.removeItem('coffeeShopOrders');
                Swal.fire('Carrito Vacío', 'Se han eliminado todos los elementos del carrito.', 'success');
            }
        });
    });

    function calculateTotalPrice(coffeeType, quantity) {
        const pricePerCup = coffeePrices[coffeeType];
        return pricePerCup * quantity;
    }

    function updateOrderResult() {
        orderResult.innerHTML = '';
        orders.forEach((order, index) => {
            const orderText = `${order.quantity} ${order.coffeeType}(s) - $${order.totalPrice.toFixed(2)}`;
            const removeButton = document.createElement('button');
            removeButton.innerText = 'Remover';
            removeButton.addEventListener('click', function () {
                orders.splice(index, 1);
                updateOrderResult();
                updateTotalDisplay();
                localStorage.setItem('coffeeShopOrders', JSON.stringify(orders));
            });

            const orderItem = document.createElement('div');
            orderItem.appendChild(document.createTextNode(orderText));
            orderItem.appendChild(removeButton);
            orderResult.appendChild(orderItem);
        });
    }

    function updateTotalDisplay() {
        const total = orders.reduce((acc, order) => acc + order.totalPrice, 0);
        totalDisplay.innerText = `Total: $${total.toFixed(2)}`;
    }

    checkoutButton.addEventListener('click', function () {
        if (orders.length === 0) {
            Swal.fire({
                icon: 'info',
                title: '¡Carrito Vacío!',
                text: 'No hay elementos en el carrito. Por favor, añade productos antes de realizar el checkout.',
            });
        } else {
            window.location.href = 'checkout.html';
        }
    });
});
