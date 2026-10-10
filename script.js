/* =========================================================
   FINTRACK — DAY 14
   PERSONAL FINANCE TRACKER
========================================================= */


/* =========================================================
   CATEGORIES
========================================================= */

const CATEGORIES = {

  expense: [
    "Food & Dining",
    "Transport",
    "Shopping",
    "Bills & Utilities",
    "Education",
    "Entertainment",
    "Health",
    "Travel",
    "Other"
  ],

  income: [
    "Salary",
    "Freelance",
    "Business",
    "Investment",
    "Gift",
    "Other"
  ]

};


/* =========================================================
   CATEGORY META
========================================================= */

const CATEGORY_META = {

  "Food & Dining": {
    icon: "🍴",
    color: "#ef4444"
  },

  "Transport": {
    icon: "🚗",
    color: "#f97316"
  },

  "Shopping": {
    icon: "🛍",
    color: "#8b5cf6"
  },

  "Bills & Utilities": {
    icon: "💡",
    color: "#eab308"
  },

  "Education": {
    icon: "📚",
    color: "#0ea5e9"
  },

  "Entertainment": {
    icon: "🎬",
    color: "#ec4899"
  },

  "Health": {
    icon: "❤",
    color: "#14b8a6"
  },

  "Travel": {
    icon: "✈",
    color: "#6366f1"
  },

  "Other": {
    icon: "•",
    color: "#64748b"
  },

  "Salary": {
    icon: "💼",
    color: "#22c55e"
  },

  "Freelance": {
    icon: "💻",
    color: "#16a34a"
  },

  "Business": {
    icon: "🏢",
    color: "#059669"
  },

  "Investment": {
    icon: "📈",
    color: "#10b981"
  },

  "Gift": {
    icon: "🎁",
    color: "#f43f5e"
  }

};


/* =========================================================
   DEFAULT BUDGETS
========================================================= */

const DEFAULT_BUDGETS = {

  "Food & Dining": 8000,

  "Transport": 4000,

  "Shopping": 6000,

  "Bills & Utilities": 7000,

  "Education": 5000,

  "Entertainment": 3000,

  "Health": 3000,

  "Travel": 5000,

  "Other": 2000

};


/* =========================================================
   LOCAL STORAGE KEYS
========================================================= */

const STORAGE_KEYS = {

  transactions:
    "fintrack_transactions_v1",

  budgets:
    "fintrack_budgets_v1",

  goal:
    "fintrack_goal_v1",

  theme:
    "fintrack_theme_v1"

};


/* =========================================================
   APPLICATION STATE
========================================================= */

let transactions =
  load(
    STORAGE_KEYS.transactions,
    []
  );

let budgets =
  load(
    STORAGE_KEYS.budgets,
    DEFAULT_BUDGETS
  );

let savingsGoal =
  Number(
    localStorage.getItem(
      STORAGE_KEYS.goal
    ) || 0
  );

let selectedMonth =
  getMonthKey(
    new Date()
  );

let cashflowChart = null;

let categoryChart = null;

let editingId = null;


/* =========================================================
   HELPERS
========================================================= */

const $ = selector =>
  document.querySelector(selector);

const $$ = selector =>
  [...document.querySelectorAll(selector)];


/* =========================================================
   START
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  init
);


/* =========================================================
   INITIALIZE
========================================================= */

function init() {

  seedDemoDataIfEmpty();

  setupMonthSelect();

  setupCategorySelects();

  setupEvents();

  applyStoredTheme();

  renderAll();

}


/* =========================================================
   LOCAL STORAGE
========================================================= */

function load(
  key,
  fallback
) {

  try {

    const value =
      localStorage.getItem(key);

    return value
      ? JSON.parse(value)
      : fallback;

  } catch (error) {

    console.error(error);

    return fallback;

  }

}


function save(
  key,
  value
) {

  localStorage.setItem(
    key,
    JSON.stringify(value)
  );

}


/* =========================================================
   DATE FUNCTIONS
========================================================= */

function getMonthKey(date) {

  const d =
    new Date(date);

  return `${d.getFullYear()}-${String(
    d.getMonth() + 1
  ).padStart(2, "0")}`;

}


function todayISO() {

  const d =
    new Date();

  return `${d.getFullYear()}-${String(
    d.getMonth() + 1
  ).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;

}


/* =========================================================
   DEMO DATA
========================================================= */

function seedDemoDataIfEmpty() {

  if (
    transactions.length
  ) {
    return;
  }

  const now =
    new Date();

  const y =
    now.getFullYear();

  const m =
    String(
      now.getMonth() + 1
    ).padStart(2, "0");


  transactions = [

    makeDemo(
      "Salary",
      "Salary",
      50000,
      `${y}-${m}-01`,
      "Monthly salary"
    ),

    makeDemo(
      "Rent",
      "Bills & Utilities",
      12000,
      `${y}-${m}-02`,
      "Monthly rent"
    ),

    makeDemo(
      "Groceries",
      "Food & Dining",
      3200,
      `${y}-${m}-04`,
      "Weekly groceries"
    ),

    makeDemo(
      "Metro & Cab",
      "Transport",
      1800,
      `${y}-${m}-06`,
      "Commute"
    ),

    makeDemo(
      "Online Course",
      "Education",
      1499,
      `${y}-${m}-08`,
      "Frontend workshop"
    ),

    makeDemo(
      "Movie Night",
      "Entertainment",
      850,
      `${y}-${m}-10`,
      "Weekend"
    ),

    makeDemo(
      "Freelance Work",
      "Freelance",
      7000,
      `${y}-${m}-13`,
      "Small project"
    ),

    makeDemo(
      "New Backpack",
      "Shopping",
      2100,
      `${y}-${m}-15`,
      "College backpack"
    )

  ];


  save(
    STORAGE_KEYS.transactions,
    transactions
  );

}


/* =========================================================
   DEMO TRANSACTION
========================================================= */

function makeDemo(
  description,
  category,
  amount,
  date,
  note
) {

  return {

    id:
      crypto.randomUUID
        ? crypto.randomUUID()
        : String(
            Date.now() +
            Math.random()
          ),

    description,

    category,

    amount,

    date,

    note,

    type:
      [
        "Salary",
        "Freelance"
      ].includes(category)
        ? "income"
        : "expense"

  };

}


/* =========================================================
   MONTH SELECT
========================================================= */

function setupMonthSelect() {

  const select =
    $("#monthSelect");

  select.innerHTML = "";

  const months = [];

  const base =
    new Date();


  for (
    let i = 0;
    i < 6;
    i++
  ) {

    const d =
      new Date(
        base.getFullYear(),
        base.getMonth() - i,
        1
      );

    months.push(
      getMonthKey(d)
    );

  }


  months.forEach(
    key => {

      const [
        y,
        m
      ] =
        key.split("-");


      const label =
        new Date(
          Number(y),
          Number(m) - 1,
          1
        ).toLocaleString(
          undefined,
          {
            month: "long",
            year: "numeric"
          }
        );


      const option =
        document.createElement(
          "option"
        );

      option.value =
        key;

      option.textContent =
        label;

      select.appendChild(
        option
      );

    }
  );


  select.value =
    selectedMonth;

}


/* =========================================================
   CATEGORY SELECTS
========================================================= */

function setupCategorySelects() {

  const select =
    $("#transactionCategory");

  select.innerHTML = "";

  populateCategoryOptions(
    "expense"
  );

  updateCategoryFilter();

}


function populateCategoryOptions(
  type
) {

  const select =
    $("#transactionCategory");

  const list =
    CATEGORIES[type] || [];


  select.innerHTML =
    list
      .map(
        category => `
          <option
            value="${escapeHTML(category)}"
          >
            ${escapeHTML(category)}
          </option>
        `
      )
      .join("");

}


function updateCategoryFilter() {

  const filter =
    $("#categoryFilter");

  const selected =
    filter.value;

  const all =
    [
      ...new Set(
        Object.values(
          CATEGORIES
        ).flat()
      )
    ].sort();


  filter.innerHTML =
    `
      <option value="all">
        All categories
      </option>
    ` +
    all
      .map(
        category => `
          <option
            value="${escapeHTML(category)}"
          >
            ${escapeHTML(category)}
          </option>
        `
      )
      .join("");


  filter.value =
    all.includes(selected)
      ? selected
      : "all";

}


/* =========================================================
   EVENTS
========================================================= */

function setupEvents() {


  /* Navigation */

  $$(".nav-link")
    .forEach(
      button => {

        button.addEventListener(
          "click",
          () =>
            switchSection(
              button.dataset.section
            )
        );

      }
    );


  /* Dashboard links */

  $$("[data-jump]")
    .forEach(
      button => {

        button.addEventListener(
          "click",
          () =>
            switchSection(
              button.dataset.jump
            )
        );

      }
    );


  /* Month */

  $("#monthSelect")
    .addEventListener(
      "change",
      event => {

        selectedMonth =
          event.target.value;

        renderAll();

      }
    );


  /* Add transaction */

  $("#openTransactionModal")
    .addEventListener(
      "click",
      () =>
        openModal()
    );


  $("#openTransactionModal2")
    .addEventListener(
      "click",
      () =>
        openModal()
    );


  /* Mobile menu */

  $("#mobileMenu")
    .addEventListener(
      "click",
      () =>
        $("#sidebar")
          .classList
          .toggle("open")
    );


  /* Theme */

  $("#themeToggle")
    .addEventListener(
      "click",
      toggleTheme
    );


  /* Close modal */

  $$("[data-close-modal]")
    .forEach(
      element => {

        element.addEventListener(
          "click",
          closeModal
        );

      }
    );


  /* Type switch */

  $$(
    "#transactionForm input[name=transactionType]"
  )
    .forEach(
      radio => {

        radio.addEventListener(
          "change",
          event => {

            populateCategoryOptions(
              event.target.value
            );

          }
        );

      }
    );


  /* Submit */

  $("#transactionForm")
    .addEventListener(
      "submit",
      handleTransactionSubmit
    );


  /* Search */

  $("#transactionSearch")
    .addEventListener(
      "input",
      renderTransactionsTable
    );


  /* Type filter */

  $("#typeFilter")
    .addEventListener(
      "change",
      renderTransactionsTable
    );


  /* Category filter */

  $("#categoryFilter")
    .addEventListener(
      "change",
      renderTransactionsTable
    );


  /* Table actions */

  $("#transactionsTable")
    .addEventListener(
      "click",
      handleTableAction
    );


  /* Goal */

  $("#saveGoalBtn")
    .addEventListener(
      "click",
      saveGoal
    );


  /* Escape */

  window.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Escape"
      ) {

        closeModal();

      }

    }
  );

}


/* =========================================================
   SECTION NAVIGATION
========================================================= */

function switchSection(
  section
) {

  $$(".nav-link")
    .forEach(
      button => {

        button.classList.toggle(
          "active",
          button.dataset.section ===
            section
        );

      }
    );


  $$(".page-section")
    .forEach(
      sectionElement => {

        sectionElement.classList.toggle(
          "active",
          sectionElement.id ===
            `section-${section}`
        );

      }
    );


  const titles = {

    dashboard:
      [
        "PERSONAL FINANCE",
        "Good to see you."
      ],

    transactions:
      [
        "MONEY ACTIVITY",
        "Your transactions."
      ],

    budgets:
      [
        "PLAN AHEAD",
        "Your monthly budgets."
      ]

  };


  $("#pageKicker")
    .textContent =
    titles[section][0];


  $("#pageTitle")
    .textContent =
    titles[section][1];


  $("#sidebar")
    .classList
    .remove("open");


  if (
    section === "dashboard"
  ) {

    renderDashboardCharts();

  }


  if (
    section === "transactions"
  ) {

    renderTransactionsTable();

  }


  if (
    section === "budgets"
  ) {

    renderBudgets();

  }

}


/* =========================================================
   CURRENT MONTH TRANSACTIONS
========================================================= */

function getMonthTransactions() {

  return transactions.filter(
    transaction =>
      getMonthKey(
        transaction.date
      ) === selectedMonth
  );

}


/* =========================================================
   FINANCIAL SUMMARY
========================================================= */

function calculateSummary() {

  const monthTransactions =
    getMonthTransactions();


  const income =
    monthTransactions
      .filter(
        transaction =>
          transaction.type ===
          "income"
      )
      .reduce(
        (
          sum,
          transaction
        ) =>
          sum +
          Number(
            transaction.amount
          ),
        0
      );


  const expense =
    monthTransactions
      .filter(
        transaction =>
          transaction.type ===
          "expense"
      )
      .reduce(
        (
          sum,
          transaction
        ) =>
          sum +
          Number(
            transaction.amount
          ),
        0
      );


  const balance =
    income - expense;


  const savingRate =
    income
      ? (
          balance /
          income
        ) *
        100
      : 0;


  return {

    monthTransactions,

    income,

    expense,

    balance,

    savingRate

  };

}


/* =========================================================
   CURRENCY
========================================================= */

function formatCurrency(
  value
) {

  return new Intl.NumberFormat(
    "en-IN",
    {

      style: "currency",

      currency: "INR",

      maximumFractionDigits: 0

    }
  ).format(value || 0);

}


/* =========================================================
   DATE FORMAT
========================================================= */

function formatDate(
  date
) {

  return new Date(
    `${date}T00:00:00`
  ).toLocaleDateString(
    undefined,
    {

      day: "numeric",

      month: "short",

      year: "numeric"

    }
  );

}


/* =========================================================
   RENDER EVERYTHING
========================================================= */

function renderAll() {

  const summary =
    calculateSummary();


  /* Balance */

  $("#heroBalance")
    .textContent =
    formatCurrency(
      summary.balance
    );


  $("#totalBalance")
    .textContent =
    formatCurrency(
      summary.balance
    );


  /* Income */

  $("#totalIncome")
    .textContent =
    formatCurrency(
      summary.income
    );


  /* Expense */

  $("#totalExpense")
    .textContent =
    formatCurrency(
      summary.expense
    );


  /* Savings */

  $("#savingRate")
    .textContent =
    `${Math.round(
      summary.savingRate
    )}%`;


  /* Notes */

  $("#balanceNote")
    .textContent =
    summary.balance >= 0
      ? "You are in positive territory"
      : "Expenses are above income";


  $("#incomeNote")
    .textContent =
    `${
      summary.monthTransactions
        .filter(
          t =>
            t.type ===
            "income"
        )
        .length
    } income entries`;


  $("#expenseNote")
    .textContent =
    `${
      summary.monthTransactions
        .filter(
          t =>
            t.type ===
            "expense"
        )
        .length
    } expense entries`;


  $("#savingNote")
    .textContent =
    summary.savingRate >= 20
      ? "Healthy saving pace"
      : "Consider saving more";


  /* Cash flow */

  $("#cashFlowPill")
    .textContent =
    summary.balance >= 0
      ? "Positive cash flow"
      : "Over budget";


  $("#cashFlowPill")
    .classList.toggle(
      "danger",
      summary.balance < 0
    );


  /* Other sections */

  renderRecentTransactions(
    summary.monthTransactions
  );

  renderBudgetSummary(
    summary.monthTransactions
  );

  renderDashboardCharts();

  renderTransactionsTable();

  renderBudgets();

  renderSavingsGoal(
    summary
  );

  updateSidebarGoal(
    summary
  );

}


/* =========================================================
   RECENT TRANSACTIONS
========================================================= */

function renderRecentTransactions(
  items
) {

  const sorted =
    [...items]
      .sort(
        (a, b) =>
          new Date(b.date) -
          new Date(a.date)
      )
      .slice(0, 6);


  const root =
    $("#recentTransactions");


  if (
    !sorted.length
  ) {

    root.innerHTML = `

      <div class="empty-state">

        <div class="empty-icon">
          ⌁
        </div>

        <h3>
          No activity
        </h3>

        <p>
          Add your first transaction.
        </p>

      </div>

    `;

    return;

  }


  root.innerHTML =
    sorted
      .map(
        transaction => `

          <div class="transaction-row">

            <div
              class="
                transaction-avatar
                ${
                  transaction.type ===
                  "income"
                    ? "avatar-income"
                    : "avatar-expense"
                }
              "
            >
              ${
                CATEGORY_META[
                  transaction.category
                ]?.icon ||
                "•"
              }
            </div>


            <div>

              <strong>
                ${escapeHTML(
                  transaction.description
                )}
              </strong>

              <span>
                ${
                  escapeHTML(
                    transaction.category
                  )
                }
                ·
                ${
                  formatDate(
                    transaction.date
                  )
                }
              </span>

            </div>


            <div
              class="
                amount
                ${transaction.type}
              "
            >

              ${
                transaction.type ===
                "income"
                  ? "+"
                  : "-"
              }

              ${
                formatCurrency(
                  transaction.amount
                )
              }

            </div>

          </div>

        `
      )
      .join("");

}


/* =========================================================
   BUDGET SUMMARY
========================================================= */

function renderBudgetSummary(
  monthItems
) {

  const expenses =
    sumByCategory(
      monthItems.filter(
        transaction =>
          transaction.type ===
          "expense"
      )
    );


  const categories =
    Object.keys(
      DEFAULT_BUDGETS
    ).slice(0, 5);


  $("#budgetSummary")
    .innerHTML =
    categories
      .map(
        category => {

          const spent =
            expenses[category] ||
            0;

          const limit =
            Number(
              budgets[category] ||
              0
            );

          const percentage =
            limit
              ? Math.min(
                  100,
                  (
                    spent /
                    limit
                  ) *
                    100
                )
              : 0;


          return `

            <div class="budget-item">

              <div class="budget-item-head">

                <span>

                  ${
                    CATEGORY_META[
                      category
                    ]?.icon ||
                    "•"
                  }

                  ${escapeHTML(
                    category
                  )}

                </span>

                <span>

                  ${
                    formatCurrency(
                      spent
                    )
                  }

                  /

                  ${
                    formatCurrency(
                      limit
                    )
                  }

                </span>

              </div>


              <div class="progress-track">

                <div
                  class="
                    progress-fill
                    ${
                      spent >
                      limit
                        ? "over"
                        : ""
                    }
                  "
                  style="
                    width:
                    ${percentage}%
                  "
                ></div>

              </div>

            </div>

          `;

        }
      )
      .join("");

}


/* =========================================================
   CHARTS
========================================================= */

function renderDashboardCharts() {

  if (
    !$("#cashflowChart")
  ) {

    return;

  }


  if (
    typeof Chart ===
    "undefined"
  ) {

    return;

  }


  /* ---------------------------------
     CASH FLOW CHART
  --------------------------------- */

  const current =
    getMonthTransactions();


  const labels =
    buildDateLabels(
      selectedMonth
    );


  const incomeDaily =
    labels.map(
      date =>
        sumDay(
          current,
          date,
          "income"
        )
    );


  const expenseDaily =
    labels.map(
      date =>
        sumDay(
          current,
          date,
          "expense"
        )
    );


  const shortLabels =
    labels.map(
      date =>
        new Date(
          `${date}T00:00:00`
        ).getDate()
    );


  if (
    cashflowChart
  ) {

    cashflowChart.destroy();

  }


  cashflowChart =
    new Chart(
      $("#cashflowChart"),
      {

        type: "line",

        data: {

          labels:
            shortLabels,

          datasets: [

            {

              label:
                "Income",

              data:
                incomeDaily,

              borderColor:
                "#16a34a",

              backgroundColor:
                "rgba(22,163,74,.08)",

              tension:
                .35,

              fill:
                true,

              pointRadius:
                2

            },


            {

              label:
                "Expenses",

              data:
                expenseDaily,

              borderColor:
                "#dc2626",

              backgroundColor:
                "rgba(220,38,38,.05)",

              tension:
                .35,

              fill:
                true,

              pointRadius:
                2

            }

          ]

        },


        options: {

          responsive:
            true,

          maintainAspectRatio:
            false,

          interaction: {

            mode:
              "index",

            intersect:
              false

          },


          plugins: {

            legend: {

              display:
                true,

              position:
                "bottom",

              labels: {

                usePointStyle:
                  true,

                boxWidth:
                  7

              }

            }

          },


          scales: {

            y: {

              beginAtZero:
                true,

              grid: {

                color:
                  "rgba(148,163,184,.13)"

              },

              ticks: {

                callback:
                  value =>
                    "₹" +
                    Number(
                      value
                    )
                      .toLocaleString(
                        "en-IN"
                      )

              }

            },


            x: {

              grid: {

                display:
                  false

              }

            }

          }

        }

      }
    );


  /* ---------------------------------
     EXPENSE CATEGORY CHART
  --------------------------------- */

  const categoryTotals =
    sumByCategory(
      current.filter(
        transaction =>
          transaction.type ===
          "expense"
      )
    );


  const entries =
    Object.entries(
      categoryTotals
    )
      .filter(
        ([, value]) =>
          value > 0
      )
      .sort(
        (a, b) =>
          b[1] -
          a[1]
      );


  if (
    categoryChart
  ) {

    categoryChart.destroy();

  }


  if (
    entries.length
  ) {

    categoryChart =
      new Chart(
        $("#categoryChart"),
        {

          type:
            "doughnut",

          data: {

            labels:
              entries.map(
                ([key]) =>
                  key
              ),

            datasets: [

              {

                data:
                  entries.map(
                    ([, value]) =>
                      value
                  ),

                backgroundColor:
                  entries.map(
                    ([key]) =>
                      CATEGORY_META[
                        key
                      ]?.color ||
                      "#64748b"
                  ),

                borderWidth:
                  0,

                hoverOffset:
                  4

              }

            ]

          },


          options: {

            responsive:
              true,

            maintainAspectRatio:
              false,

            cutout:
              "72%",

            plugins: {

              legend: {

                display:
                  false

              }

            }

          }

        }
      );

  }


  /* LEGEND */

  $("#categoryLegend")
    .innerHTML =
    entries
      .slice(0, 6)
      .map(
        ([name, value]) => `

          <div
            class="legend-item"
          >

            <span
              class="legend-dot"
              style="
                background:
                ${
                  CATEGORY_META[
                    name
                  ]?.color ||
                  "#64748b"
                }
              "
            ></span>

            <span class="legend-name">
              ${escapeHTML(name)}
            </span>

            <span class="legend-value">
              ${formatCurrency(value)}
            </span>

          </div>

        `
      )
      .join("")
      ||

      `<span
        style="
          color:var(--muted);
          font-size:12px;
        "
      >
        No expense data yet.
      </span>`;

}


/* =========================================================
   DATE LABELS
========================================================= */

function buildDateLabels(
  monthKey
) {

  const [
    year,
    month
  ] =
    monthKey
      .split("-")
      .map(Number);


  const days =
    new Date(
      year,
      month,
      0
    ).getDate();


  return Array.from(
    {
      length:
        days
    },
    (_, i) =>

      `${year}-${
        String(month)
          .padStart(2, "0")
      }-${
        String(i + 1)
          .padStart(2, "0")
      }`

  );

}


/* =========================================================
   SUM DAILY DATA
========================================================= */

function sumDay(
  items,
  day,
  type
) {

  return items
    .filter(
      transaction =>
        transaction.type ===
          type &&
        transaction.date ===
          day
    )
    .reduce(
      (
        sum,
        transaction
      ) =>
        sum +
        Number(
          transaction.amount
        ),
      0
    );

}


/* =========================================================
   SUM CATEGORY
========================================================= */

function sumByCategory(
  items
) {

  return items.reduce(
    (
      accumulator,
      transaction
    ) => {

      accumulator[
        transaction.category
      ] =
        (
          accumulator[
            transaction.category
          ] ||
          0
        ) +
        Number(
          transaction.amount
        );

      return accumulator;

    },
    {}
  );

}


/* =========================================================
   TRANSACTION TABLE
========================================================= */

function renderTransactionsTable() {

  const query =
    (
      $(
        "#transactionSearch"
      ).value ||
      ""
    )
      .trim()
      .toLowerCase();


  const type =
    $("#typeFilter")
      .value;


  const category =
    $("#categoryFilter")
      .value;


  const filtered =
    getMonthTransactions()
      .filter(
        transaction => {

          const matchesSearch =
            [
              transaction.description,
              transaction.category,
              transaction.note
            ]
              .join(" ")
              .toLowerCase()
              .includes(
                query
              );


          const matchesType =
            type === "all" ||
            transaction.type ===
              type;


          const matchesCategory =
            category === "all" ||
            transaction.category ===
              category;


          return (
            matchesSearch &&
            matchesType &&
            matchesCategory
          );

        }
      )
      .sort(
        (a, b) =>
          new Date(b.date) -
          new Date(a.date)
      );


  const tbody =
    $("#transactionsTable");


  $("#transactionEmpty")
    .classList.toggle(
      "hidden",
      filtered.length !==
        0
    );


  tbody.innerHTML =
    filtered
      .map(
        transaction => `

          <tr>

            <td>

              <strong>
                ${escapeHTML(
                  transaction.description
                )}
              </strong>

              <small>
                ${escapeHTML(
                  transaction.note ||
                  "No note"
                )}
              </small>

            </td>


            <td>

              ${escapeHTML(
                transaction.category
              )}

            </td>


            <td>

              ${formatDate(
                transaction.date
              )}

            </td>


            <td>

              <span
                class="
                  type-badge
                  ${transaction.type}
                "
              >
                ${transaction.type}
              </span>

            </td>


            <td
              class="
                amount
                ${transaction.type}
              "
            >

              ${
                transaction.type ===
                "income"
                  ? "+"
                  : "-"
              }

              ${
                formatCurrency(
                  transaction.amount
                )
              }

            </td>


            <td>

              <div
                class="action-group"
              >

                <button
                  class="action-btn"
                  data-action="edit"
                  data-id="${transaction.id}"
                  title="Edit"
                >
                  ✎
                </button>

                <button
                  class="action-btn"
                  data-action="delete"
                  data-id="${transaction.id}"
                  title="Delete"
                >
                  ×
                </button>

              </div>

            </td>

          </tr>

        `
      )
      .join("");

}


/* =========================================================
   TABLE ACTION
========================================================= */

function handleTableAction(
  event
) {

  const button =
    event.target.closest(
      "[data-action]"
    );


  if (!button) {

    return;

  }


  const id =
    button.dataset.id;


  const action =
    button.dataset.action;


  const transaction =
    transactions.find(
      item =>
        item.id ===
        id
    );


  if (!transaction) {

    return;

  }


  /* EDIT */

  if (
    action ===
    "edit"
  ) {

    openModal(
      transaction
    );

  }


  /* DELETE */

  if (
    action ===
    "delete"
  ) {

    const okay =
      confirm(
        `Delete "${transaction.description}"?`
      );


    if (!okay) {

      return;

    }


    transactions =
      transactions.filter(
        item =>
          item.id !==
          id
      );


    save(
      STORAGE_KEYS.transactions,
      transactions
    );


    showToast(
      "Transaction deleted"
    );


    renderAll();

  }

}


/* =========================================================
   OPEN MODAL
========================================================= */

function openModal(
  item = null
) {

  editingId =
    item?.id ||
    null;


  $("#transactionModal")
    .classList
    .remove("hidden");


  $("#modalTitle")
    .textContent =
    item
      ? "Edit Transaction"
      : "Add Transaction";


  $("#saveTransactionBtn")
    .textContent =
    item
      ? "Update Transaction"
      : "Save Transaction";


  const type =
    item?.type ||
    "expense";


  document
    .querySelector(
      `input[name="transactionType"][value="${type}"]`
    )
    .checked =
    true;


  populateCategoryOptions(
    type
  );


  $("#transactionId")
    .value =
    item?.id ||
    "";


  $("#description")
    .value =
    item?.description ||
    "";


  $("#amount")
    .value =
    item?.amount ||
    "";


  $("#transactionCategory")
    .value =
    item?.category ||
    CATEGORIES[
      type
    ][0];


  $("#transactionDate")
    .value =
    item?.date ||
    todayISO();


  $("#note")
    .value =
    item?.note ||
    "";


  setTimeout(
    () =>
      $("#description")
        .focus(),
    50
  );

}


/* =========================================================
   CLOSE MODAL
========================================================= */

function closeModal() {

  $("#transactionModal")
    .classList
    .add("hidden");


  $("#transactionForm")
    .reset();


  editingId =
    null;

}


/* =========================================================
   SAVE TRANSACTION
========================================================= */

function handleTransactionSubmit(
  event
) {

  event.preventDefault();


  const type =
    document
      .querySelector(
        'input[name="transactionType"]:checked'
      )
      .value;


  const entry = {

    id:
      editingId ||
      (
        crypto.randomUUID
          ? crypto.randomUUID()
          : String(
              Date.now() +
              Math.random()
            )
      ),

    description:
      $("#description")
        .value
        .trim(),

    amount:
      Number(
        $("#amount").value
      ),

    category:
      $("#transactionCategory")
        .value,

    date:
      $("#transactionDate")
        .value,

    note:
      $("#note")
        .value
        .trim(),

    type

  };


  /* Validation */

  if (
    !entry.description ||
    !entry.amount ||
    !entry.date
  ) {

    showToast(
      "Please complete all required fields"
    );

    return;

  }


  /* UPDATE */

  if (
    editingId
  ) {

    transactions =
      transactions.map(
        transaction =>
          transaction.id ===
          editingId
            ? entry
            : transaction
      );


    showToast(
      "Transaction updated"
    );

  }


  /* ADD */

  else {

    transactions.push(
      entry
    );

    showToast(
      "Transaction added"
    );

  }


  save(
    STORAGE_KEYS.transactions,
    transactions
  );


  closeModal();


  renderAll();

}


/* =========================================================
   BUDGETS
========================================================= */

function renderBudgets() {

  const expenseTotals =
    sumByCategory(
      getMonthTransactions()
        .filter(
          transaction =>
            transaction.type ===
            "expense"
        )
    );


  $("#budgetCards")
    .innerHTML =
    Object.entries(
      budgets
    )
      .map(
        (
          [category, limit]
        ) => {

          const spent =
            expenseTotals[
              category
            ] || 0;


          const percentage =
            limit
              ? Math.min(
                  100,
                  (
                    spent /
                    Number(limit)
                  ) *
                    100
                )
              : 0;


          return `

            <article
              class="budget-card"
            >

              <span class="eyebrow">

                ${
                  CATEGORY_META[
                    category
                  ]?.icon ||
                  "•"
                }

                Category

              </span>


              <h3>

                ${escapeHTML(
                  category
                )}

              </h3>


              <div class="spent">

                ${formatCurrency(
                  spent
                )}

              </div>


              <div
                class="budget-meta"
              >

                <span>

                  ${
                    Math.round(
                      percentage
                    )
                  }%
                  used

                </span>

                <span>

                  Limit
                  ${formatCurrency(
                    limit
                  )}

                </span>

              </div>


              <div
                class="progress-track"
              >

                <div
                  class="
                    progress-fill
                    ${
                      spent >
                      limit
                        ? "over"
                        : ""
                    }
                  "
                  style="
                    width:
                    ${percentage}%
                  "
                ></div>

              </div>


              <div
                style="
                  display:flex;
                  gap:7px;
                  margin-top:12px;
                "
              >

                <input
                  type="number"
                  min="0"
                  step="500"
                  value="${limit}"
                  data-budget-input="${escapeHTML(category)}"
                  aria-label="Budget for ${escapeHTML(category)}"
                />

                <button
                  class="secondary-btn"
                  data-save-budget="${escapeHTML(category)}"
                >
                  Save
                </button>

              </div>

            </article>

          `;

        }
      )
      .join("");


  /* Budget save buttons */

  $$(
    "#budgetCards [data-save-budget]"
  )
    .forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            const category =
              button.dataset
                .saveBudget;


            const input =
              $(
                `[data-budget-input="${CSS.escape(category)}"]`
              );


            const amount =
              Number(
                input.value
              );


            budgets[
              category
            ] =
              Math.max(
                0,
                amount
              );


            save(
              STORAGE_KEYS.budgets,
              budgets
            );


            showToast(
              `${category} budget updated`
            );


            renderAll();

          }
        );

      }
    );

}


/* =========================================================
   SAVINGS GOAL
========================================================= */

function renderSavingsGoal(
  summary
) {

  $("#goalAmountDisplay")
    .textContent =
    formatCurrency(
      savingsGoal
    );


  const progress =
    savingsGoal > 0

      ? Math.max(
          0,
          Math.min(
            100,
            (
              summary.balance /
              savingsGoal
            ) *
              100
          )
        )

      : 0;


  $("#goalDescription")
    .textContent =
    savingsGoal

      ? `${Math.round(
          progress
        )}% of your goal based on this month's balance.`

      : "Set a target to track your progress.";


  $("#mainGoalProgress")
    .style
    .width =
    `${progress}%`;


  $("#mainGoalProgress")
    .classList
    .toggle(
      "over",
      progress < 0
    );


  $("#savingsGoalInput")
    .value =
    savingsGoal ||
    "";

}


/* =========================================================
   SIDEBAR GOAL
========================================================= */

function updateSidebarGoal(
  summary
) {

  $("#sidebarSavings")
    .textContent =
    formatCurrency(
      summary.balance
    );


  const progress =
    savingsGoal > 0

      ? Math.max(
          0,
          Math.min(
            100,
            (
              summary.balance /
              savingsGoal
            ) *
              100
          )
        )

      : 0;


  $("#sidebarProgress")
    .style
    .width =
    `${progress}%`;


  $("#sidebarProgress")
    .classList
    .toggle(
      "over",
      summary.balance < 0
    );


  $("#sidebarGoalText")
    .textContent =
    savingsGoal

      ? `${Math.round(
          progress
        )}% of your monthly savings target`

      : "Set your savings goal in the budget panel.";

}


/* =========================================================
   SAVE GOAL
========================================================= */

function saveGoal() {

  const value =
    Number(
      $("#savingsGoalInput")
        .value
    );


  if (
    !Number.isFinite(value) ||
    value < 0
  ) {

    showToast(
      "Enter a valid savings goal"
    );

    return;

  }


  savingsGoal =
    value;


  localStorage.setItem(
    STORAGE_KEYS.goal,
    String(
      savingsGoal
    )
  );


  showToast(
    "Savings goal saved"
  );


  renderAll();

}


/* =========================================================
   THEME
========================================================= */

function toggleTheme() {

  document.body
    .classList
    .toggle("dark");


  localStorage.setItem(
    STORAGE_KEYS.theme,
    document.body.classList.contains(
      "dark"
    )
      ? "dark"
      : "light"
  );


  renderDashboardCharts();

}


function applyStoredTheme() {

  if (
    localStorage.getItem(
      STORAGE_KEYS.theme
    ) ===
    "dark"
  ) {

    document.body
      .classList
      .add("dark");

  }

}


/* =========================================================
   TOAST
========================================================= */

function showToast(
  message
) {

  const toast =
    $("#toast");


  toast.textContent =
    message;


  toast.classList
    .add("show");


  clearTimeout(
    showToast.timer
  );


  showToast.timer =
    setTimeout(
      () =>
        toast.classList
          .remove("show"),
      2400
    );

}


/* =========================================================
   SECURITY / HTML ESCAPING
========================================================= */

function escapeHTML(
  value
) {

  return String(
    value ?? ""
  )
    .replaceAll(
      "&",
      "&amp;"
    )
    .replaceAll(
      "<",
      "&lt;"
    )
    .replaceAll(
      ">",
      "&gt;"
    )
    .replaceAll(
      '"',
      "&quot;"
    )
    .replaceAll(
      "'",
      "&#039;"
    );

}