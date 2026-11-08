const sourceJson = `{
  "event": {
    "title": "Ночь в музее",
    "date": "15 ноября, 18:30",
    "place": "Музей космонавтики, проспект Мира, 111",
    "description": "Вечерняя программа с выставкой и экскурсиями",
    "meeting": "Сбор: 18:30. Начало: 19:00."
  },
  "services": [
    { "id": "guide", "title": "  Экскурсия с гидом  ", "price": 500 },
    { "id": "audio", "title": "Аудиогид", "price": 350 },
    { "id": "catalog", "title": "Каталог выставки", "price": 250 }
  ]
}`;

const programBtn = document.querySelector('#show-program');
const programBox = document.querySelector('#program');
const serviceForm = document.querySelector('#service-form');
const guideInput = document.querySelector('#guide');
const audioInput = document.querySelector('#audio');
const catalogInput = document.querySelector('#catalog');
const choiceErrorBox = document.querySelector('#choice-error');
const dataErrorBox = document.querySelector('#data-error');
const resultBox = document.querySelector('#result');
const jsonBox = document.querySelector('#report-json');

let data;

try {
  data = JSON.parse(sourceJson);
} catch (err) {
  data = undefined;
}

function buildReport(services, guideChecked, audioChecked, catalogChecked) {
  // какие услуги отмечены, по id
  const marks = {
    guide: guideChecked,
    audio: audioChecked,
    catalog: catalogChecked,
  };

  const chosen = services.filter((service) => marks[service.id]);

  const items = chosen.map((service) => {
    const { title, price } = service;
    return {
      title: title.trim(),
      price,
    };
  });

  const total = items.reduce((acc, item) => acc + item.price, 0);

  return { count: items.length, total, items };
}

function onProgramClick() {
  programBox.innerHTML = data.event.meeting;
  programBox.hidden = false;
}

function hideResult() {
  resultBox.hidden = true;
  jsonBox.hidden = true;
}

function onFormSubmit(event) {
  event.preventDefault();

  const report = buildReport(
    data.services,
    guideInput.checked,
    audioInput.checked,
    catalogInput.checked
  );

  if (report.count === 0) {
    choiceErrorBox.textContent = 'Выберите хотя бы одну услугу.';
    choiceErrorBox.hidden = false;
    hideResult();
    return;
  }

  choiceErrorBox.hidden = true;

  const lines = [`Выбрано услуг: ${report.count}`, `Итого: ${report.total} руб.`];
  report.items.forEach((item) => {
    lines.push(item.title);
  });
  resultBox.innerHTML = lines.join('<br>');

  const reportJson = JSON.stringify(report);
  const checkReport = JSON.parse(reportJson);
  if (checkReport.count === report.count) {
    jsonBox.textContent = reportJson;
  }

  resultBox.hidden = false;
  jsonBox.hidden = false;
}

if (data) {
  serviceForm.hidden = false;
  programBtn.addEventListener('click', onProgramClick);
  serviceForm.addEventListener('submit', onFormSubmit);
} else {
  dataErrorBox.textContent = 'Ошибка данных.';
  dataErrorBox.hidden = false;
  serviceForm.hidden = true;
}
