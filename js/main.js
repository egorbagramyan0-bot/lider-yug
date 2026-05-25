document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initFaqAccordion();
  initBookingForm();
  initReviews();
  initContactForm();
  initComfortCarousel();
});

// Mobile Navigation Menu Toggle
function initMobileMenu() {
  const menuToggle = document.querySelector('.btn-menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      navLinks.classList.toggle('active');
      document.documentElement.classList.toggle('menu-open', !isExpanded);
      document.body.classList.toggle('menu-open', !isExpanded);
      
      // Animate hamburger lines if they exist
      const lines = menuToggle.querySelectorAll('line');
      if (lines.length === 3) {
        if (!isExpanded) {
          lines[0].setAttribute('y1', '6'); lines[0].setAttribute('y2', '18');
          lines[1].setAttribute('opacity', '0');
          lines[2].setAttribute('y1', '18'); lines[2].setAttribute('y2', '6');
        } else {
          lines[0].setAttribute('y1', '6'); lines[0].setAttribute('y2', '6');
          lines[1].setAttribute('opacity', '1');
          lines[2].setAttribute('y1', '18'); lines[2].setAttribute('y2', '18');
        }
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
        menuToggle.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('active');
        document.documentElement.classList.remove('menu-open');
        document.body.classList.remove('menu-open');
        const lines = menuToggle.querySelectorAll('line');
        if (lines.length === 3) {
          lines[0].setAttribute('y1', '6'); lines[0].setAttribute('y2', '6');
          lines[1].setAttribute('opacity', '1');
          lines[2].setAttribute('y1', '18'); lines[2].setAttribute('y2', '18');
        }
      }
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('active');
        document.documentElement.classList.remove('menu-open');
        document.body.classList.remove('menu-open');
        const lines = menuToggle.querySelectorAll('line');
        if (lines.length === 3) {
          lines[0].setAttribute('y1', '6'); lines[0].setAttribute('y2', '6');
          lines[1].setAttribute('opacity', '1');
          lines[2].setAttribute('y1', '18'); lines[2].setAttribute('y2', '18');
        }
      });
    });
  }
}

// FAQ Accordion
function initFaqAccordion() {
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const item = question.parentElement;
      const answer = question.nextElementSibling;
      const isActive = question.classList.contains('active');
      
      // Close other accordion items
      document.querySelectorAll('.faq-question').forEach(q => {
        if (q !== question) {
          q.classList.remove('active');
          q.nextElementSibling.style.maxHeight = null;
          q.nextElementSibling.style.paddingTop = '0';
          q.nextElementSibling.style.borderTopColor = 'transparent';
        }
      });
      
      // Toggle current item
      if (!isActive) {
        question.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 32 + 'px'; // add spacing
        answer.style.paddingTop = '1.5rem';
        answer.style.borderTopColor = 'var(--color-border-light)';
      } else {
        question.classList.remove('active');
        answer.style.maxHeight = null;
        answer.style.paddingTop = '0';
        answer.style.borderTopColor = 'transparent';
      }
    });
  });
}

// Dynamic Booking Calculator and Setup
function initBookingForm() {
  const bookingForm = document.getElementById('bookingForm');
  if (!bookingForm) return;

  const routeSelect = document.getElementById('route');
  const pickupSelect = document.getElementById('pickup_location');
  const dropoffSelect = document.getElementById('dropoff_location');
  const departureTimeSelect = document.getElementById('departure_time');
  const dateInput = document.getElementById('booking_date');
  const passengersInput = document.getElementById('passengers');
  const luggageInput = document.getElementById('luggage');

  // Summary Elements
  const summaryRoute = document.getElementById('summary-route');
  const summaryPickup = document.getElementById('summary-pickup');
  const summaryDropoff = document.getElementById('summary-dropoff');
  const summaryDate = document.getElementById('summary-date');
  const summaryTime = document.getElementById('summary-time');
  const summaryPassengers = document.getElementById('summary-passengers');
  const summaryLuggage = document.getElementById('summary-luggage');
  const summaryPrice = document.getElementById('summary-price');
  const summaryTotal = document.getElementById('summary-total-price');

  // Route Stops Definitions
  const routeStopsForward = [
    "Ростов-на-Дону",
    "Шахты",
    "Зверево",
    "Лиховской мост",
    "Калитва",
    "Тацинская",
    "Морозовск",
    "Чернышковский",
    "Обливская",
    "Суровикино",
    "Калач-на-Дону",
    "Волгоград"
  ];

  const routeStopsBackward = [
    "Волгоград",
    "Калач-на-Дону",
    "Суровикино",
    "Обливская",
    "Чернышковский",
    "Морозовск",
    "Тацинская",
    "Калитва",
    "Лиховской мост",
    "Зверево",
    "Шахты",
    "Ростов-на-Дону"
  ];

  // Fare Matrix for Pair-based Tariff lookups
  const fareMatrix = {
    // Forward direction: Rostov-on-Don -> Volgograd
    "Ростов-на-Дону|Волгоград": 3500,
    "Ростов-на-Дону|Калач-на-Дону": 3500,
    "Ростов-на-Дону|Суровикино": 3000,
    "Ростов-на-Дону|Обливская": 3000,
    "Ростов-на-Дону|Чернышковский": 3000,
    "Ростов-на-Дону|Морозовск": 2700,
    "Ростов-на-Дону|Тацинская": 3000,
    "Ростов-на-Дону|Калитва": 3000,
    "Ростов-на-Дону|Лиховской мост": 3000,
    
    "Шахты|Волгоград": 3500,
    "Шахты|Калач-на-Дону": 3500,
    "Шахты|Суровикино": 3000,
    "Шахты|Обливская": 3000,
    "Шахты|Чернышковский": 3000,
    "Шахты|Морозовск": 2700,
    "Шахты|Тацинская": 3000,
    "Шахты|Калитва": 3000,
    "Шахты|Лиховской мост": 3000,

    "Зверево|Волгоград": 3500,
    "Зверево|Калач-на-Дону": 3500,
    "Зверево|Суровикино": 3000,
    "Зверево|Обливская": 3000,
    "Зверево|Чернышковский": 3000,
    "Зверево|Морозовск": 2700,
    "Зверево|Тацинская": 3000,
    "Зверево|Калитва": 3000,
    "Зверево|Лиховской мост": 3000,

    "Лиховской мост|Волгоград": 3000,
    "Лиховской мост|Калач-на-Дону": 3000,
    "Калитва|Волгоград": 3000,
    "Калитва|Калач-на-Дону": 3000,
    "Тацинская|Волгоград": 3000,
    "Тацинская|Калач-на-Дону": 3000,

    "Морозовск|Волгоград": 2700,
    "Морозовск|Калач-на-Дону": 2700,

    "Чернышковский|Волгоград": 3000,
    "Чернышковский|Калач-на-Дону": 3000,
    "Обливская|Волгоград": 3000,
    "Обливская|Калач-на-Дону": 3000,
    "Суровикино|Волгоград": 3000,
    "Суровикино|Калач-на-Дону": 3000,

    // Backward direction: Volgograd -> Rostov-on-Don
    "Волгоград|Ростов-на-Дону": 3500,
    "Волгоград|Шахты": 3500,
    "Волгоград|Зверево": 3500,
    "Волгоград|Лиховской мост": 3000,
    "Волгоград|Калитва": 3000,
    "Волгоград|Тацинская": 3000,
    "Волгоград|Морозовск": 2700,
    "Волгоград|Чернышковский": 3000,
    "Волгоград|Обливская": 3000,
    "Волгоград|Суровикино": 3000,

    "Калач-на-Дону|Ростов-на-Дону": 3500,
    "Калач-на-Дону|Шахты": 3500,
    "Калач-на-Дону|Зверево": 3500,
    "Калач-на-Дону|Лиховской мост": 3000,
    "Калач-на-Дону|Калитва": 3000,
    "Калач-на-Дону|Тацинская": 3000,
    "Калач-на-Дону|Морозовск": 2700,
    
    "Морозовск|Ростов-на-Дону": 2700,
    "Морозовск|Шахты": 2700,
    "Морозовск|Зверево": 2700,
    "Морозовск|Лиховской мост": 2700,
    "Морозовск|Калитва": 2700,
    "Морозовск|Тацинская": 2700,

    "Суровикино|Ростов-на-Дону": 3000,
    "Суровикино|Шахты": 3000,
    "Суровикино|Зверево": 3000,
    "Суровикино|Лиховской мост": 2700,
    "Суровикино|Калитва": 2700,
    "Суровикино|Тацинская": 2700,

    "Обливская|Ростов-на-Дону": 3000,
    "Обливская|Шахты": 3000,
    "Обливская|Зверево": 3000,
    "Обливская|Лиховской мост": 2700,
    "Обливская|Калитва": 2700,
    "Обливская|Тацинская": 2700,

    "Чернышковский|Ростов-на-Дону": 3000,
    "Чернышковский|Шахты": 3000,
    "Чернышковский|Зверево": 3000,
    "Чернышковский|Лиховской мост": 2700,
    "Чернышковский|Калитва": 2700,
    "Чернышковский|Тацинская": 2700
  };

  function getFare(pickupStop, dropoffStop) {
    if (!pickupStop || !dropoffStop) return 3500;
    const key = `${pickupStop}|${dropoffStop}`;
    return fareMatrix[key] ?? 3500;
  }

  // Fare and Route Matrix
  const routeData = {
    'rostov-volgograd': {
      title: 'Ростов-на-Дону → Волгоград',
      times: ['08:00', '17:00'],
      stops: routeStopsForward
    },
    'volgograd-rostov': {
      title: 'Волгоград → Rostov-на-Дону',
      times: ['08:00', '16:00'],
      stops: routeStopsBackward
    }
  };

  // Block Past Dates
  if (dateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    dateInput.min = `${yyyy}-${mm}-${dd}`;
    dateInput.value = `${yyyy}-${mm}-${dd}`;
  }

  // Update form fields dynamically based on route selection
  function updateRouteFields() {
    const selectedRoute = routeSelect.value;
    const data = routeData[selectedRoute];
    if (!data) return;

    // Update Times dropdown
    departureTimeSelect.innerHTML = '';
    data.times.forEach(time => {
      const option = document.createElement('option');
      option.value = time;
      option.textContent = time;
      departureTimeSelect.appendChild(option);
    });

    // Reset Pickup Locations dropdown
    pickupSelect.innerHTML = '';
    const pickupPlaceholder = document.createElement('option');
    pickupPlaceholder.value = '';
    pickupPlaceholder.disabled = true;
    pickupPlaceholder.selected = true;
    pickupPlaceholder.textContent = 'Выберите место посадки';
    pickupSelect.appendChild(pickupPlaceholder);

    // Populate pickup select options (all stops except the very last one)
    const stops = data.stops;
    for (let i = 0; i < stops.length - 1; i++) {
      const option = document.createElement('option');
      option.value = stops[i];
      option.textContent = stops[i];
      pickupSelect.appendChild(option);
    }

    // Reset and disable Dropoff Locations dropdown
    dropoffSelect.innerHTML = '';
    const dropoffPlaceholder = document.createElement('option');
    dropoffPlaceholder.value = '';
    dropoffPlaceholder.disabled = true;
    dropoffPlaceholder.selected = true;
    dropoffPlaceholder.textContent = 'Сначала выберите место посадки';
    dropoffSelect.appendChild(dropoffPlaceholder);
    dropoffSelect.disabled = true;

    calculatePrice();
  }

  // Update available dropoff fields based on pickup selection
  function updateDropoffFields() {
    const selectedRoute = routeSelect.value;
    const data = routeData[selectedRoute];
    if (!data) return;

    const selectedPickup = pickupSelect.value;
    if (!selectedPickup) {
      dropoffSelect.innerHTML = '';
      const dropoffPlaceholder = document.createElement('option');
      dropoffPlaceholder.value = '';
      dropoffPlaceholder.disabled = true;
      dropoffPlaceholder.selected = true;
      dropoffPlaceholder.textContent = 'Сначала выберите место посадки';
      dropoffSelect.appendChild(dropoffPlaceholder);
      dropoffSelect.disabled = true;
      calculatePrice();
      return;
    }

    // Find pickup index in route stops
    const stops = data.stops;
    const pickupIndex = stops.indexOf(selectedPickup);
    if (pickupIndex === -1) return;

    const previousDropoffVal = dropoffSelect.value;

    dropoffSelect.innerHTML = '';
    dropoffSelect.disabled = false;

    const dropoffPlaceholder = document.createElement('option');
    dropoffPlaceholder.value = '';
    dropoffPlaceholder.disabled = true;
    dropoffPlaceholder.selected = true;
    dropoffPlaceholder.textContent = 'Выберите место высадки';
    dropoffSelect.appendChild(dropoffPlaceholder);

    // Only add stops after the pickup index
    const availableStops = stops.slice(pickupIndex + 1);
    let isPreviousDropoffValid = false;

    availableStops.forEach(stop => {
      const option = document.createElement('option');
      option.value = stop;
      option.textContent = stop;
      dropoffSelect.appendChild(option);

      if (stop === previousDropoffVal) {
        isPreviousDropoffValid = true;
      }
    });

    if (isPreviousDropoffValid && previousDropoffVal) {
      dropoffSelect.value = previousDropoffVal;
    } else {
      dropoffSelect.value = '';
    }

    calculatePrice();
  }

  // Calculate Price and Update Summary Card
  function calculatePrice() {
    const selectedRoute = routeSelect.value;
    const data = routeData[selectedRoute];
    if (!data) return;

    const selectedPickupVal = pickupSelect.value;
    const selectedDropoffVal = dropoffSelect.value;

    const stopPrice = getFare(selectedPickupVal, selectedDropoffVal);

    const passengersCount = parseInt(passengersInput.value) || 1;
    
    if (luggageInput) {
      const maxLuggage = passengersCount * 3;
      luggageInput.max = maxLuggage;
      if (parseInt(luggageInput.value) > maxLuggage) {
        luggageInput.value = maxLuggage;
      }
    }
    
    const additionalLuggage = parseInt(luggageInput.value) || 0;

    // Pricing rules:
    // 1 piece up to 20kg free per passenger. Additional luggage: 300 руб. per piece.
    const ticketTotal = stopPrice * passengersCount;
    const luggageTotal = additionalLuggage * 300;
    const totalCost = ticketTotal + luggageTotal;

    // Update Summary UI
    if (summaryRoute) summaryRoute.textContent = data.title;
    
    if (summaryPickup) {
      summaryPickup.textContent = selectedPickupVal || '—';
    }
    if (summaryDropoff) {
      summaryDropoff.textContent = selectedDropoffVal || '—';
    }

    if (summaryDate) {
      const dateVal = new Date(dateInput.value);
      summaryDate.textContent = !isNaN(dateVal.getTime()) 
        ? dateVal.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }) 
        : dateInput.value;
    }
    if (summaryTime) summaryTime.textContent = departureTimeSelect.value || '—';
    if (summaryPassengers) summaryPassengers.textContent = `${passengersCount} чел.`;
    if (summaryLuggage) summaryLuggage.textContent = `${additionalLuggage} доп. мест`;
    
    if (summaryPrice) {
      summaryPrice.textContent = `${stopPrice} руб. × ${passengersCount}`;
    }
    if (summaryTotal) {
      summaryTotal.textContent = `${totalCost} руб.`;
    }
  }

  // Swap Route Button
  const swapBtn = document.querySelector('.route-swap-btn');
  if (swapBtn) {
    swapBtn.addEventListener('click', () => {
      routeSelect.value = routeSelect.value === 'rostov-volgograd' ? 'volgograd-rostov' : 'rostov-volgograd';
      updateRouteFields();
    });
  }

  // Listen for changes
  if (routeSelect) routeSelect.addEventListener('change', updateRouteFields);
  if (pickupSelect) pickupSelect.addEventListener('change', updateDropoffFields);
  if (dropoffSelect) dropoffSelect.addEventListener('change', calculatePrice);
  if (departureTimeSelect) departureTimeSelect.addEventListener('change', calculatePrice);
  if (dateInput) dateInput.addEventListener('change', calculatePrice);
  if (passengersInput) {
    passengersInput.addEventListener('input', calculatePrice);
    passengersInput.addEventListener('change', calculatePrice);
  }
  if (luggageInput) {
    luggageInput.addEventListener('input', calculatePrice);
    luggageInput.addEventListener('change', calculatePrice);
  }

  // Messenger Selector Interactive Behavior
  const messengerCards = document.querySelectorAll('#messengerSelector .messenger-card');
  if (messengerCards) {
    messengerCards.forEach(card => {
      card.addEventListener('click', () => {
        messengerCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        const radio = card.querySelector('input[type="radio"]');
        if (radio) {
          radio.checked = true;
        }
      });
    });
  }

  // Initialize values
  if (routeSelect) {
    updateRouteFields();
  }

  // Form Submit Handler
  bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const selectedRoute = routeSelect.value;
    const data = routeData[selectedRoute];
    const departureTime = departureTimeSelect.value;
    const dateInputVal = dateInput.value;
    const passengersCount = parseInt(passengersInput.value) || 0;
    const additionalLuggage = parseInt(luggageInput.value) || 0;
    const comment = document.getElementById('comment').value.trim();

    const preferredMessengerInput = document.querySelector('input[name="preferred_messenger"]:checked');
    const preferredMessenger = preferredMessengerInput ? preferredMessengerInput.value : 'WhatsApp';

    const botcheck = document.querySelector('input[name="botcheck"]').value.trim();
    const submitBtn = document.getElementById('btn-submit-booking');
    const statusMsg = document.getElementById('bookingStatusMessage');

    // Helper functions for status feedback
    const showError = (text) => {
      statusMsg.style.display = 'block';
      statusMsg.className = 'status-msg-error';
      statusMsg.textContent = text;
      showToast(text, 'error');
    };

    const showSuccess = (text) => {
      statusMsg.style.display = 'block';
      statusMsg.className = 'status-msg-success';
      statusMsg.textContent = text;
      showToast(text, 'success');
    };

    // Reset status message
    statusMsg.style.display = 'none';
    statusMsg.className = '';
    statusMsg.textContent = '';

    // Spam honeypot check
    if (botcheck !== '') {
      console.warn('Spam submission detected by honeypot.');
      return;
    }

    // Form Validations
    if (!name) {
      showError('Пожалуйста, введите ваше имя.');
      return;
    }
    if (!phone) {
      showError('Пожалуйста, введите ваш номер телефона.');
      return;
    }
    if (!selectedRoute) {
      showError('Пожалуйста, выберите направление поездки.');
      return;
    }
    const pickupVal = pickupSelect.value;
    const pickupText = pickupSelect.options[pickupSelect.selectedIndex] ? pickupSelect.options[pickupSelect.selectedIndex].text : '';
    const dropoffVal = dropoffSelect.value;
    const dropoffText = dropoffSelect.options[dropoffSelect.selectedIndex] ? dropoffSelect.options[dropoffSelect.selectedIndex].text : '';

    if (!pickupVal) {
      showError('Пожалуйста, выберите место посадки.');
      return;
    }
    if (!dropoffVal) {
      showError('Пожалуйста, выберите место высадки.');
      return;
    }

    // Verify route ordering sequence
    const stops = data.stops;
    const pickupIndex = stops.indexOf(pickupVal);
    const dropoffIndex = stops.indexOf(dropoffVal);

    if (pickupIndex === -1 || dropoffIndex === -1 || dropoffIndex <= pickupIndex) {
      showError('Некорректный маршрут поездки. Место высадки должно быть после места посадки.');
      return;
    }

    if (!dateInputVal) {
      showError('Пожалуйста, выберите дату поездки.');
      return;
    }
    if (!departureTime) {
      showError('Пожалуйста, выберите время отправления.');
      return;
    }
    if (passengersCount <= 0) {
      showError('Количество пассажиров должно быть больше 0.');
      return;
    }
    if (!preferredMessenger) {
      showError('Пожалуйста, выберите предпочтительный способ связи.');
      return;
    }

    // Get fare price from matrix
    const stopPrice = getFare(pickupVal, dropoffVal);
    
    // Formatting date
    const dateVal = new Date(dateInputVal);
    const dateFormatted = !isNaN(dateVal.getTime()) 
      ? dateVal.toLocaleDateString('ru-RU', { day: 'numeric', month: 'numeric', year: 'numeric' }) 
      : dateInputVal;

    // Calculation total price
    const ticketTotal = stopPrice * passengersCount;
    const luggageTotal = additionalLuggage * 300;
    const totalCost = ticketTotal + luggageTotal;

    // Compose formatted email message
    let emailMessage = `Новая заявка с сайта Лидер Юг\n\n`;
    emailMessage += `ДАННЫЕ ПОЕЗДКИ:\n`;
    emailMessage += `Направление: ${data.title}\n`;
    emailMessage += `Место посадки: ${pickupText}\n`;
    emailMessage += `Место высадки: ${dropoffText}\n`;
    emailMessage += `Дата поездки: ${dateFormatted}\n`;
    emailMessage += `Время отправления: ${departureTime}\n`;
    emailMessage += `Пассажиров: ${passengersCount}\n`;
    emailMessage += `Доп. багаж: ${additionalLuggage} доп. мест\n\n`;
    
    emailMessage += `КОНТАКТЫ ПАССАЖИРА:\n`;
    emailMessage += `Имя: ${name}\n`;
    emailMessage += `Телефон: ${phone}\n`;
    emailMessage += `Предпочтительный мессенджер: ${preferredMessenger}\n`;
    if (comment) {
      emailMessage += `Пожелания: ${comment}\n`;
    }
    emailMessage += `\n`;
    
    emailMessage += `ОПЛАТА:\n`;
    emailMessage += `Цена билета: ${stopPrice} руб. × ${passengersCount}\n`;
    emailMessage += `Доп. багаж: 300 руб. / шт (всего: ${luggageTotal} руб.)\n`;
    emailMessage += `Итого к оплате: ${totalCost} руб.\n\n`;
    
    emailMessage += `Источник: сайт Лидер Юг\n`;
    emailMessage += `Время заявки: ${new Date().toLocaleString("ru-RU")}`;

    // Enable loading states
    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправляем...';

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          access_key: "85bc6e6b-ca48-4fc2-8315-d417c4d7d207",
          subject: "Новая заявка с сайта Лидер Юг",
          from_name: "Сайт Лидер Юг",
          botcheck: botcheck,
          route: data.title,
          pickup_location: pickupText,
          dropoff_location: dropoffText,
          trip_date: dateFormatted,
          departure_time: departureTime,
          passengers_count: passengersCount,
          extra_baggage: `${additionalLuggage} доп. мест`,
          passenger_name: name,
          phone: phone,
          preferred_messenger: preferredMessenger,
          ticket_price: `${stopPrice} руб. × ${passengersCount}`,
          baggage_price: "300 руб. / шт",
          total_price: `${totalCost} руб.`,
          comment: comment,
          source: "Сайт Лидер Юг",
          submitted_at: new Date().toLocaleString("ru-RU"),
          message: emailMessage
        })
      });

      const result = await response.json();

      if (result.success) {
        showSuccess('Спасибо! Заявка отправлена. Оператор свяжется с вами в ближайшее время.');
        // Clear only Passenger Contacts input fields
        document.getElementById('name').value = '';
        document.getElementById('phone').value = '';
        document.getElementById('comment').value = '';
      } else {
        showError('Не удалось отправить заявку. Пожалуйста, попробуйте позже или позвоните нам.');
      }
    } catch (error) {
      console.error('Error submitting booking form:', error);
      showError('Не удалось отправить заявку. Пожалуйста, попробуйте позже или позвоните нам.');
    } finally {
      // Restore submit button state
      submitBtn.disabled = false;
      submitBtn.textContent = 'Забронировать поездку';
    }
  });
}

// Toast Notifications Helper
function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span class="toast-message">${message}</span>
    <button class="toast-close">&times;</button>
  `;

  // Apply Toast CSS on the fly to keep code modular
  if (!document.getElementById('toast-styles')) {
    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.textContent = `
      .toast-container {
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        z-index: 1000;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        max-width: 400px;
      }
      .toast {
        background-color: var(--color-primary);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--border-radius-md);
        box-shadow: var(--shadow-lg);
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1.5rem;
        animation: toast-in 300ms ease-out forwards;
        border-left: 4px solid var(--color-secondary);
      }
      .toast-success {
        border-left-color: var(--color-success);
      }
      .toast-error {
        border-left-color: var(--color-error);
      }
      .toast-close {
        background: none;
        border: none;
        color: rgba(255,255,255,0.6);
        font-size: 1.25rem;
        cursor: pointer;
        line-height: 1;
      }
      .toast-close:hover {
        color: white;
      }
      @keyframes toast-in {
        from { transform: translateY(100%) scale(0.9); opacity: 0; }
        to { transform: translateY(0) scale(1); opacity: 1; }
      }
      @keyframes toast-out {
        to { transform: translateY(50%) scale(0.9); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  container.appendChild(toast);

  const closeToast = () => {
    toast.style.animation = 'toast-out 250ms ease-in forwards';
    toast.addEventListener('animationend', () => {
      toast.remove();
      if (container.children.length === 0) {
        container.remove();
      }
    });
  };

  toast.querySelector('.toast-close').addEventListener('click', closeToast);

  // Auto close after 4 seconds
  setTimeout(closeToast, 4000);
}

// Reviews system logic (Filtering and Review Modal)
function initReviews() {
  const reviewsContainer = document.getElementById('reviews-list-container');
  if (!reviewsContainer) return;

  const filterTabs = document.querySelectorAll('.review-filter-tab');
  const reviewModal = document.getElementById('reviewModal');
  const openModalBtn = document.getElementById('btn-open-review-modal');
  const closeModalBtn = document.querySelector('.close-modal');
  const writeReviewForm = document.getElementById('writeReviewForm');

  // Star Rating interactive input selection
  const ratingStars = document.querySelectorAll('.rating-input-stars svg');
  const ratingValueInput = document.getElementById('rating-value');

  if (ratingStars.length > 0 && ratingValueInput) {
    ratingStars.forEach(star => {
      star.addEventListener('click', () => {
        const rating = star.dataset.rating;
        ratingValueInput.value = rating;
        
        ratingStars.forEach(s => {
          if (s.dataset.rating <= rating) {
            s.classList.add('active');
          } else {
            s.classList.remove('active');
          }
        });
      });

      // Hover feedback
      star.addEventListener('mouseover', () => {
        const rating = star.dataset.rating;
        ratingStars.forEach(s => {
          if (s.dataset.rating <= rating) {
            s.classList.add('hover');
          } else {
            s.classList.remove('hover');
          }
        });
      });

      star.addEventListener('mouseout', () => {
        ratingStars.forEach(s => s.classList.remove('hover'));
      });
    });
  }

  // Pre-load default local reviews if localStorage is empty
  const defaultReviews = [
    { name: 'Дмитрий К.', rating: 5, date: '15 мая 2026', text: 'Поездка из Ростова в Волгоград прошла на ура! Отличный новый минивен с кондиционером, чистый салон. Водитель вежливый, ехал аккуратно. Всем рекомендую!', type: 'rostov-volgograd' },
    { name: 'Ольга С.', rating: 5, date: '28 апреля 2026', text: 'Заказывала место до Морозовска. Машина приехала вовремя, без задержек. Удобные кресла, время пролетело незаметно. Огромное спасибо компании.', type: 'rostov-volgograd' },
    { name: 'Сергей И.', rating: 4, date: '14 апреля 2026', text: 'Пользуюсь услугами Лидер Юг регулярно для поездок по работе. Всегда вовремя. Водители знают трассу, едут уверенно. Один раз кондиционер работал слишком сильно, но по просьбе убавили.', type: 'volgograd-rostov' },
    { name: 'Мария П.', rating: 5, date: '30 марта 2026', text: 'Комфортабельный минивэн, вежливый персонал. Забирали от трассы возле Шахт, очень удобно. Большой плюс — один багаж бесплатно!', type: 'rostov-volgograd' },
    { name: 'Александр В.', rating: 5, date: '12 марта 2026', text: 'Отличный сервис. Ехал из Волгограда в Ростов. Комфорт на высоте, сидения раскладываются. Приехали даже чуть раньше расписания. Буду обращаться еще.', type: 'volgograd-rostov' }
  ];

  if (!localStorage.getItem('lider_yug_reviews')) {
    localStorage.setItem('lider_yug_reviews', JSON.stringify(defaultReviews));
  }

  function getReviews() {
    return JSON.parse(localStorage.getItem('lider_yug_reviews'));
  }

  function renderReviews(filter = 'all') {
    const reviews = getReviews();
    reviewsContainer.innerHTML = '';

    const filteredReviews = filter === 'all' 
      ? reviews 
      : reviews.filter(r => r.type === filter);

    if (filteredReviews.length === 0) {
      reviewsContainer.innerHTML = '<div class="text-center text-muted" style="padding: 2rem;">Отзывов пока нет. Станьте первым!</div>';
      return;
    }

    filteredReviews.forEach(review => {
      const card = document.createElement('div');
      card.className = 'review-card';
      
      let starsHtml = '';
      for (let i = 1; i <= 5; i++) {
        starsHtml += `
          <svg class="star ${i <= review.rating ? 'filled' : ''}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
          </svg>
        `;
      }

      const routeLabel = review.type === 'rostov-volgograd' 
        ? 'Ростов-на-Дону ⇄ Волгоград' 
        : 'Волгоград ⇄ Ростов-на-Дону';

      card.innerHTML = `
        <div class="review-card-header">
          <div>
            <h4 class="review-author">${review.name}</h4>
            <span class="review-route-badge">${routeLabel}</span>
          </div>
          <span class="review-date">${review.date}</span>
        </div>
        <div class="review-rating">${starsHtml}</div>
        <p class="review-text">${review.text}</p>
      `;

      reviewsContainer.appendChild(card);
    });
  }

  // Filter Event Listeners
  if (filterTabs.length > 0) {
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        renderReviews(tab.dataset.filter);
      });
    });
  }

  // Modal actions
  if (openModalBtn && reviewModal) {
    openModalBtn.addEventListener('click', () => {
      reviewModal.style.display = 'block';
      document.body.style.overflow = 'hidden';
    });

    closeModalBtn.addEventListener('click', () => {
      reviewModal.style.display = 'none';
      document.body.style.overflow = 'auto';
    });

    window.addEventListener('click', (e) => {
      if (e.target === reviewModal) {
        reviewModal.style.display = 'none';
        document.body.style.overflow = 'auto';
      }
    });
  }

  // Review Form Submit
  if (writeReviewForm) {
    writeReviewForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('review-name').value.trim();
      const rating = parseInt(ratingValueInput.value) || 5;
      const routeType = document.getElementById('review-route').value;
      const text = document.getElementById('review-text-content').value.trim();

      if (!name || !text) {
        alert('Пожалуйста, заполните имя и текст отзыва.');
        return;
      }

      const reviews = getReviews();
      const today = new Date();
      const options = { day: 'numeric', month: 'long', year: 'numeric' };
      const dateStr = today.toLocaleDateString('ru-RU', options);

      const newReview = {
        name: name,
        rating: rating,
        date: dateStr,
        text: text,
        type: routeType
      };

      reviews.unshift(newReview);
      localStorage.setItem('lider_yug_reviews', JSON.stringify(reviews));

      // Reset Form & Close Modal
      writeReviewForm.reset();
      ratingValueInput.value = '5';
      ratingStars.forEach(s => s.classList.add('active'));
      
      if (reviewModal) {
        reviewModal.style.display = 'none';
        document.body.style.overflow = 'auto';
      }

      showToast('Спасибо за ваш отзыв! Он успешно добавлен.');
      
      // Re-render
      const activeFilterTab = document.querySelector('.review-filter-tab.active');
      renderReviews(activeFilterTab ? activeFilterTab.dataset.filter : 'all');
    });
  }

  // Initial render
  renderReviews();
}

// Simple Contact Form submission (Footer & Contacts)
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = contactForm.querySelector('[name="contact-name"]').value.trim();
      const phone = contactForm.querySelector('[name="contact-phone"]').value.trim();
      const message = contactForm.querySelector('[name="contact-message"]').value.trim();
      
      if (!name || !phone) {
        showToast('Пожалуйста, заполните имя и номер телефона.', 'error');
        return;
      }

      let whatsappMsg = `Здравствуйте! Мой вопрос по перевозкам.\n👤 Имя: ${name}\n📞 Телефон: ${phone}`;
      if (message) {
        whatsappMsg += `\n💬 Вопрос: ${message}`;
      }

      const whatsappPhone = '79282294992'; 
      const encodedMsg = encodeURIComponent(whatsappMsg);
      const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodedMsg}`;

      showToast('Запрос отправлен! Открываем WhatsApp...');
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 1500);
      
      contactForm.reset();
    });
  }
}

// Comfort Section Carousel
function initComfortCarousel() {
  const container = document.getElementById('comfortCarousel');
  if (!container) return;

  const slides = container.querySelectorAll('.carousel-slide');
  const indicators = container.querySelectorAll('.carousel-indicators .indicator');
  const prevBtn = container.querySelector('.carousel-arrow.prev');
  const nextBtn = container.querySelector('.carousel-arrow.next');

  let currentIndex = 0;
  let autoplayTimer = null;

  function showSlide(index) {
    if (index >= slides.length) currentIndex = 0;
    else if (index < 0) currentIndex = slides.length - 1;
    else currentIndex = index;

    slides.forEach((slide, i) => {
      if (i === currentIndex) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    indicators.forEach((indicator, i) => {
      if (i === currentIndex) {
        indicator.classList.add('active');
      } else {
        indicator.classList.remove('active');
      }
    });
  }

  function nextSlide() {
    showSlide(currentIndex + 1);
  }

  function prevSlide() {
    showSlide(currentIndex - 1);
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(nextSlide, 4500);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      startAutoplay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      startAutoplay();
    });
  }

  indicators.forEach(indicator => {
    indicator.addEventListener('click', () => {
      const index = parseInt(indicator.dataset.slide);
      showSlide(index);
      startAutoplay();
    });
  });

  container.addEventListener('mouseenter', stopAutoplay);
  container.addEventListener('mouseleave', startAutoplay);
  container.addEventListener('touchstart', stopAutoplay, { passive: true });
  container.addEventListener('touchend', startAutoplay, { passive: true });

  startAutoplay();
}
