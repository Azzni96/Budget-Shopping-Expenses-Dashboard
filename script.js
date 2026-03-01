(() => {
  // -------- Storage keys
  const K = {
    lang: "org_lang_v1",
    page: "org_page_v1",
    todo: "org_todo_v1",
    notes: "org_notes_v1",
    calendar: "org_calendar_v1",
    expenses: "org_expenses_v1",
    habits: "org_habits_v1",
    goals: "org_goals_v1",
    health: "org_health_v1",
    shopping: "org_shopping_v1",
    reading: "org_reading_v1",
    budget: "org_budget_v1",
    badges: "org_badges_v1"
  };

  const $ = (id) => document.getElementById(id);
  const pad2 = (n) => String(n).padStart(2, "0");
  const todayISO = () => {
    const d = new Date();
    return `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`;
  };
  const monthISO = (d) => `${d.getFullYear()}-${pad2(d.getMonth()+1)}`;
  const nowMonthISO = () => monthISO(new Date());

  const uuid = () => crypto?.randomUUID ? crypto.randomUUID() : String(Date.now()) + "_" + Math.random().toString(16).slice(2);

  const load = (key, fallback) => {
    try{
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    }catch{ return fallback; }
  };
  const save = (key, val) => localStorage.setItem(key, JSON.stringify(val));

  // -------- Live Clock
  const updateClock = () => {
    const now = new Date();
    const hours = pad2(now.getHours());
    const minutes = pad2(now.getMinutes());
    const seconds = pad2(now.getSeconds());
    const timeEl = $("liveTime");
    if (timeEl) {
      timeEl.textContent = `${hours}:${minutes}:${seconds}`;
    }
  };
  updateClock();
  setInterval(updateClock, 1000);

  let lang = localStorage.getItem(K.lang) || "fi";
  let currentPage = localStorage.getItem(K.page) || "dashboard";

  // -------- i18n
  const T = {
    fi: {
      appTitle:"💰 Budjetti Ostos Kulut Hallinta",
      appSubtitle:"Seuraa ostoksiasi, budjettia ja kuluja. Kaikki data tallennetaan selaimeen.",
      tabs:{
        dashboard:"📊 Kojelauta",
        shopping:"🛒 Ostoslista",
        expenses:"💳 Kulut",
        budget:"💰 Budjetti"
      },
      dashboard:{
        summary:"Yhteenveto",
        shoppingToBuy:"🛒 Ostettavaa",
        budgetStatusLabel:"💰 Budjetti",
        monthlyExpensesLabel:"💳 Tämän kuukauden kulut",
        todaysSpending:"Tänään käytetty",
        thisMonth:"Tämä kuukausi",
        toShop:"Ostettavaa",
        budgetLeft:"Budjettia jäljellä",
        shoppingComplete:"✅ Ostoslista valmis!",
        noExpensesMonth:"Ei kuluja tänä kuussa"
      },
      shopping:{
        small:"Ostos",
        big:"Älykäs lista",
        count:"Tuotteet",
        listTitle:"Ostoslista",
        listBig:"Napsauta ostaa",
        item:"Tuote",
        category:"Kategoria",
        priority:"Prioriteetti",
        add:"Lisää",
        clear:"Tyhjennä",
        wipe:"Poista KAIKKI",
        low:"Matala",
        medium:"Keskitaso",
        high:"Korkea",
        groceries:"Ruoka",
        home:"Koti",
        tech:"Teknologia",
        clothes:"Vaatteet",
        other:"Muu"
      },
      exp:{
        listTitle:"Ostot (valittu kuukausi)",
        selMonth:"Valittu kuukausi",
        total:"Yhteensä",
        date:"Päivä",
        showMonth:"Näytä kuukausi",
        name:"Ostos",
        amount:"Määrä (€)",
        add:"Lisää ostos",
        pdf:"Vie PDF",
        clear:"Tyhjennä kentät",
        wipe:"Poista KAIKKI",
        hint:"Huom: PDF-kirjasto ladataan netistä (CDN)."
      },
      budget:{
        small:"Budjetti",
        big:"Rahanhallinointi",
        count:"Määrät",
        summary:"Analyysi",
        month:"Kuukausi",
        monthlyBudget:"Kuukausibudjetti:",
        spent:"Käytetty:",
        remaining:"Jäljellä:"
      },
      actions:{
        delete:"Poista",
        export:"Vie",
        import:"Tuo",
        done:"Valmis",
        more:"lisää"
      },
      alerts:{
        needExpDate:"Valitse päivä.",
        needExpName:"Kirjoita ostos.",
        badAmount:"Hinta pitää olla numero (esim. 3.50).",
        wipeConfirm:"Oletko varma? Tätä ei voi perua.",
        pdfFail:"PDF-kirjasto ei latautunut.",
        saved:"Tallennettu!",
        importError:"Virhe tuonnissa:",
        needBudget:"Anna kelvollinen budjetti."
      }
    },
    en: {
      appTitle:"💰 Budget Shopping Expenses Dashboard",
      appSubtitle:"Track your shopping list, budget and expenses. Data saved in your browser.",
      tabs:{
        dashboard:"📊 Dashboard",
        shopping:"🛒 Shopping List",
        expenses:"💳 Expenses",
        budget:"💰 Budget"
      },
      dashboard:{
        summary:"Summary",
        shoppingToBuy:"🛒 Shopping to Buy",
        budgetStatusLabel:"💰 Budget Status",
        monthlyExpensesLabel:"💳 This Month's Expenses",
        todaysSpending:"Today's Spending",
        thisMonth:"This Month",
        toShop:"To Shop",
        budgetLeft:"Budget Left",
        shoppingComplete:"✅ Shopping list complete!",
        noExpensesMonth:"No expenses this month"
      },
      shopping:{
        small:"Shopping",
        big:"Smart list",
        count:"Items",
        listTitle:"Shopping list",
        listBig:"Tap to buy",
        item:"Item",
        category:"Category",
        priority:"Priority",
        add:"Add",
        clear:"Clear",
        wipe:"Delete ALL",
        low:"Low",
        medium:"Medium",
        high:"High",
        groceries:"Groceries",
        home:"Home",
        tech:"Tech",
        clothes:"Clothes",
        other:"Other"
      },
      exp:{
        listTitle:"Purchases (selected month)",
        selMonth:"Selected month",
        total:"Total",
        date:"Date",
        showMonth:"Show month",
        name:"Purchase",
        amount:"Amount (€)",
        add:"Add purchase",
        pdf:"Export PDF",
        clear:"Clear fields",
        wipe:"Delete ALL",
        hint:"PDF library is loaded from CDN."
      },
      budget:{
        small:"Budget",
        big:"Track finances",
        count:"Amounts",
        summary:"Analysis",
        month:"Month",
        monthlyBudget:"Monthly Budget:",
        spent:"Spent:",
        remaining:"Remaining:"
      },
      actions:{
        delete:"Delete",
        export:"Export",
        import:"Import",
        done:"Done",
        more:"more"
      },
      alerts:{
        needExpDate:"Choose a date.",
        needExpName:"Enter a purchase.",
        badAmount:"Amount must be a number (e.g. 3.50).",
        wipeConfirm:"Are you sure? This cannot be undone.",
        pdfFail:"PDF library didn't load.",
        saved:"Saved!",
        importError:"Import error:",
        needBudget:"Enter a valid budget."
      }
    },
    ar: {
      appTitle:"💰 لوحة إدارة الميزانية والمصروفات",
      appSubtitle:"تابع مشترياتك وميزانيتك ومصروفاتك. البيانات محفوظة في المتصفح.",
      tabs:{
        dashboard:"📊 لوحة التحكم",
        shopping:"🛒 المشتريات",
        expenses:"💳 المصروفات",
        budget:"💰 الميزانية"
      },
      dashboard:{
        summary:"ملخص",
        shoppingToBuy:"🛒 للشراء",
        budgetStatusLabel:"💰 حالة الميزانية",
        monthlyExpensesLabel:"💳 مصروفات الشهر",
        todaysSpending:"مصروفات اليوم",
        thisMonth:"هذا الشهر",
        toShop:"للشراء",
        budgetLeft:"المتبقي من الميزانية",
        shoppingComplete:"✅ اكتملت القائمة!",
        noExpensesMonth:"لا توجد مصروفات هذا الشهر"
      },
      shopping:{
        small:"المشتريات",
        big:"قائمة ذكية",
        count:"البنود",
        listTitle:"قائمة المشتريات",
        listBig:"اضغط للشراء",
        item:"الصنف",
        category:"الفئة",
        priority:"الأولوية",
        add:"إضافة",
        clear:"مسح",
        wipe:"حذف الكل",
        low:"منخفضة",
        medium:"متوسطة",
        high:"عالية",
        groceries:"بقالة",
        home:"المنزل",
        tech:"تقنية",
        clothes:"ملابس",
        other:"أخرى"
      },
      exp:{
        listTitle:"المشتريات (الشهر المختار)",
        selMonth:"الشهر المختار",
        total:"المجموع",
        date:"التاريخ",
        showMonth:"عرض الشهر",
        name:"المشتريات",
        amount:"المبلغ (€)",
        add:"إضافة",
        pdf:"تصدير PDF",
        clear:"مسح الحقول",
        wipe:"حذف الكل",
        hint:"مكتبة PDF تنجلب من الإنترنت."
      },
      budget:{
        small:"الميزانية",
        big:"تتبع الأموال",
        count:"المبالغ",
        summary:"التحليل",
        month:"الشهر",
        monthlyBudget:"الميزانية الشهرية:",
        spent:"المصروف:",
        remaining:"المتبقي:"
      },
      actions:{
        delete:"حذف",
        export:"تصدير",
        import:"استيراد",
        done:"تم",
        more:"المزيد"
      },
      alerts:{
        needExpDate:"اختر تاريخ.",
        needExpName:"اكتب المشتريات.",
        badAmount:"المبلغ يجب أن يكون رقم (مثال 3.50).",
        wipeConfirm:"متأكد؟ لا يمكن التراجع.",
        pdfFail:"مكتبة PDF لم يتم تحميلها.",
        saved:"تم الحفظ!",
        importError:"خطأ في الاستيراد:",
        needBudget:"أدخل ميزانية صحيحة."
      }
    }
  };

  function setLang(newLang){
    lang = newLang;
    localStorage.setItem(K.lang, lang);

    const html = document.documentElement;
    html.lang = lang;
    html.dir = (lang === "ar") ? "rtl" : "ltr";

    // lang buttons
    ["langFI","langEN","langAR"].forEach(id => $(id).classList.remove("active"));
    $(lang === "fi" ? "langFI" : lang === "en" ? "langEN" : "langAR").classList.add("active");

    // top texts
    $("t_appTitle").textContent = T[lang].appTitle;
    $("t_appSubtitle").textContent = T[lang].appSubtitle;

    // tabs
    $("tabDashboard").textContent = T[lang].tabs.dashboard;
    $("tabShopping").textContent = T[lang].tabs.shopping;
    $("tabExpenses").textContent = T[lang].tabs.expenses;
    $("tabBudget").textContent = T[lang].tabs.budget;

    // shopping
    $("t_shoppingSmall").textContent = T[lang].shopping.small;
    $("t_shoppingBig").textContent = T[lang].shopping.big;
    $("t_shoppingCount").textContent = T[lang].shopping.count;
    $("t_shoppingItem").textContent = T[lang].shopping.item;
    $("t_shoppingCategory").textContent = T[lang].shopping.category;
    $("t_shoppingPriority").textContent = T[lang].shopping.priority;
    $("shoppingAddBtn").textContent = T[lang].shopping.add;
    $("shoppingClearBtn").textContent = T[lang].shopping.clear;
    $("shoppingWipeBtn").textContent = T[lang].shopping.wipe;
    $("shoppingExportBtn").textContent = T[lang].actions.export;
    $("shoppingImportBtn").textContent = T[lang].actions.import;
    $("t_shoppingListTitle").textContent = T[lang].shopping.listTitle;
    $("t_shoppingListBig").textContent = T[lang].shopping.listBig;

    document.querySelectorAll('option[value="low"]').forEach(el => el.textContent = T[lang].shopping.low);
    document.querySelectorAll('option[value="medium"]').forEach(el => el.textContent = T[lang].shopping.medium);
    document.querySelectorAll('option[value="high"]').forEach(el => el.textContent = T[lang].shopping.high);
    document.querySelectorAll('option[value="Groceries"]').forEach(el => el.textContent = "🛒 " + T[lang].shopping.groceries);
    document.querySelectorAll('option[value="Home"]').forEach(el => el.textContent = "🏠 " + T[lang].shopping.home);
    document.querySelectorAll('option[value="Tech"]').forEach(el => el.textContent = "💻 " + T[lang].shopping.tech);
    document.querySelectorAll('option[value="Clothes"]').forEach(el => el.textContent = "👕 " + T[lang].shopping.clothes);
    document.querySelectorAll('option[value="Other"]').forEach(el => el.textContent = "📦 " + T[lang].shopping.other);

    // dashboard
    $("t_dashSummary").textContent = T[lang].dashboard.summary;
    $("t_dashShoppingToBuy").textContent = T[lang].dashboard.shoppingToBuy;
    $("t_dashBudgetStatus").textContent = T[lang].dashboard.budgetStatusLabel;
    $("t_dashMonthlyExpenses").textContent = T[lang].dashboard.monthlyExpensesLabel;

    // expenses
    $("t_expSelectedMonth").textContent = T[lang].exp.selMonth;
    $("t_expTotalLabel").textContent = T[lang].exp.total;
    $("t_expDateLabel").textContent = T[lang].exp.date;
    $("t_expMonthFilterLabel").textContent = T[lang].exp.showMonth;
    $("t_expNameLabel").textContent = T[lang].exp.name;
    $("t_expAmountLabel").textContent = T[lang].exp.amount;
    $("expAddBtn").textContent = T[lang].exp.add;
    $("expPdfBtn").textContent = T[lang].exp.pdf;
    $("expClearBtn").textContent = T[lang].exp.clear;
    $("expWipeBtn").textContent = T[lang].exp.wipe;
    $("expExportBtn").textContent = T[lang].actions.export;
    $("expImportBtn").textContent = T[lang].actions.import;
    $("t_expHint").textContent = T[lang].exp.hint;
    $("t_expListTitle").textContent = T[lang].exp.listTitle;

    // budget
    $("t_budgetSmall").textContent = T[lang].budget.small;
    $("t_budgetBig").textContent = T[lang].budget.big;
    $("t_budgetCount").textContent = T[lang].budget.count;
    $("t_budgetMonth").textContent = T[lang].budget.month;
    $("t_budgetBudget").textContent = T[lang].budget.monthlyBudget;
    $("budgetSaveBtn").textContent = T[lang].actions.done;
    $("budgetWipeBtn").textContent = T[lang].actions.delete;
    $("budgetExportBtn").textContent = T[lang].actions.export;
    $("budgetImportBtn").textContent = T[lang].actions.import;
    $("t_budgetSummary").textContent = T[lang].budget.summary;

    renderAll();
  }

  // -------- NAV / pages
  const pages = ["dashboard","shopping","expenses","budget"];
  function showPage(p){
    currentPage = p;
    localStorage.setItem(K.page, p);

    pages.forEach(x => {
      $("page_"+x).style.display = (x===p) ? "" : "none";
      document.querySelector(`.tab[data-page="${x}"]`).classList.toggle("active", x===p);
    });
    
    if(p === "dashboard") {
      renderDashboard();
    } else if(p === "shopping") {
      renderShopping();
    } else if(p === "expenses") {
      renderExpenses();
    } else if(p === "budget") {
      renderBudget();
    }
  }
  document.querySelectorAll(".tab").forEach(btn => {
    btn.addEventListener("click", () => showPage(btn.dataset.page));
  });

  // -------- Expenses
  let expenses = load(K.expenses, []);
  const expDate = $("expDate");
  const expMonthFilter = $("expMonthFilter");
  const expName = $("expName");
  const expAmount = $("expAmount");
  const expMonthTitle = $("expMonthTitle");
  const expMonthTotal = $("expMonthTotal");
  const expCount = $("expCount");
  const expList = $("expList");
  const expEmpty = $("expEmpty");

  expDate.value = todayISO();
  expMonthFilter.value = nowMonthISO();

  const formatMoney = (num) => {
    const v = Number(num) || 0;
    return v.toLocaleString("fi-FI", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
  };

  const monthTitle = (yyyyMm) => {
    const [y, m] = yyyyMm.split("-").map(Number);
    const d = new Date(y, m - 1, 1);
    const locale = lang === "ar" ? "ar" : (lang === "en" ? "en-US" : "fi-FI");
    return d.toLocaleDateString(locale, { year: "numeric", month: "long" });
  };

  function expFiltered(){
    const ym = expMonthFilter.value || nowMonthISO();
    return expenses.filter(it => (it.date || "").startsWith(ym));
  }

  function expAdd(){
    const name = expName.value.trim();
    const date = (expDate.value || "").trim();
    const amount = Number(String(expAmount.value).replace(",", "."));

    if(!name) { alert(T[lang].alerts.needExpName); return; }
    if(!date) { alert(T[lang].alerts.needExpDate); return; }
    if(!Number.isFinite(amount) || amount < 0) { alert(T[lang].alerts.badAmount); return; }

    expenses.push({ id: uuid(), date, name, amount, createdAt: Date.now() });
    save(K.expenses, expenses);

    expName.value=""; expAmount.value="";
    expName.focus();

    const ym = date.slice(0,7);
    if(expMonthFilter.value !== ym) expMonthFilter.value = ym;

    showToast(T[lang].alerts.saved);
    renderExpenses();
    renderDashboard();
  }

  function expDelete(id){
    expenses = expenses.filter(x=>x.id!==id);
    save(K.expenses, expenses);
    renderExpenses();
    renderDashboard();
  }

  function expClear(){
    expDate.value = todayISO();
    expName.value=""; expAmount.value="";
    expName.focus();
  }

  function expWipe(){
    if(!confirm(T[lang].alerts.wipeConfirm)) return;
    expenses=[]; save(K.expenses, expenses); renderExpenses(); renderDashboard();
  }

  async function expPDF(){
    if (!window.jspdf?.jsPDF) { alert(T[lang].alerts.pdfFail); return; }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit:"mm", format:"a4" });

    const ym = expMonthFilter.value || nowMonthISO();
    const filtered = expFiltered().slice().sort((a,b)=>a.date.localeCompare(b.date));

    const title = (lang==="ar") ? `مشتريات الشهر: ${ym}` : (lang==="fi") ? `Kuukausiostot: ${ym}` : `Monthly purchases: ${ym}`;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(title, 12, 12);

    let y = 20;
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text((lang==="ar")?"تاريخ":(lang==="fi")?"Pvm":"Date", 12, y);
    doc.text((lang==="ar")?"المشتريات":(lang==="fi")?"Ostos":"Purchase", 40, y);
    doc.text("€", 190, y, { align:"right" });
    doc.setFont("helvetica", "normal");
    y += 7;

    let total = 0;
    const lineHeight = 6;
    const pageBottom = 285;

    for (const it of filtered){
      const wrapped = doc.splitTextToSize(String(it.name||""), 135);
      const needed = Math.max(1, wrapped.length) * lineHeight;
      if (y + needed > pageBottom){ doc.addPage(); y = 18; }

      doc.text(it.date, 12, y);
      doc.text(wrapped, 40, y);
      doc.text((Number(it.amount)||0).toFixed(2), 190, y, { align:"right" });

      total += (Number(it.amount)||0);
      y += needed;
    }

    if (y + 12 > pageBottom){ doc.addPage(); y = 18; }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text(((lang==="ar")?"المجموع: ":(lang==="fi")?"Yhteensä: ":"Total: ") + total.toFixed(2) + " €", 12, y + 8);

    const fname = (lang==="ar") ? `مشتريات_${ym}.pdf` : `expenses_${ym}.pdf`;
    doc.save(fname);
  }

  $("expAddBtn").addEventListener("click", expAdd);
  $("expPdfBtn").addEventListener("click", expPDF);
  $("expExportBtn").addEventListener("click", exportData);
  $("expImportBtn").addEventListener("click", importData);
  $("expClearBtn").addEventListener("click", expClear);
  $("expWipeBtn").addEventListener("click", expWipe);
  expMonthFilter.addEventListener("change", renderExpenses);
  [expName, expAmount].forEach(el => el.addEventListener("keydown", e => { if(e.key==="Enter") expAdd(); }));

  function renderExpenses(){
    const ym = expMonthFilter.value || nowMonthISO();
    const filtered = expFiltered();

    expMonthTitle.textContent = monthTitle(ym);

    const total = filtered.reduce((s,x)=>s + (Number(x.amount)||0), 0);
    expMonthTotal.textContent = formatMoney(total);
    expCount.textContent = String(filtered.length);

    expList.innerHTML="";
    expEmpty.style.display = filtered.length ? "none":"block";

    filtered.slice().sort((a,b)=>b.date.localeCompare(a.date)).forEach(it=>{
      const div=document.createElement("div");
      div.className="item";
      div.innerHTML = `
        <div>
          <div style="font-weight:950;">${escapeHtml(it.name)}</div>
          <div class="meta">${escapeHtml(it.date)}</div>
        </div>
        <div class="price">${formatMoney(it.amount)}</div>
        <div class="actions">
          <button class="iconbtn">${T[lang].actions.delete}</button>
        </div>
      `;
      div.querySelector("button").addEventListener("click", ()=>expDelete(it.id));
      expList.appendChild(div);
    });
  }

  // -------- Shopping
  let shopping = load(K.shopping, []);
  function shoppingAdd(){
    const item = $("shoppingItem").value.trim();
    if(!item) { alert(T[lang].alerts.needExpName); return; }
    const category = $("shoppingCategory").value;
    const priority = $("shoppingPriority").value;
    shopping.push({ id: uuid(), item, category, priority, bought: false, created: Date.now() });
    save(K.shopping, shopping);
    $("shoppingItem").value = "";
    $("shoppingItem").focus();
    showToast(T[lang].alerts.saved);
    renderShopping();
    renderDashboard();
  }
  function shoppingToggle(id){
    const s = shopping.find(x => x.id === id);
    if(s) {
      s.bought = !s.bought;
      save(K.shopping, shopping);
      renderShopping();
      renderDashboard();
    }
  }
  function shoppingDelete(id){
    shopping = shopping.filter(s => s.id !== id);
    save(K.shopping, shopping);
    renderShopping();
    renderDashboard();
  }
  function shoppingWipe(){
    if(!confirm(T[lang].alerts.wipeConfirm)) return;
    shopping = [];
    save(K.shopping, shopping);
    renderShopping();
    renderDashboard();
  }
  function shoppingClear(){
    $("shoppingItem").value = "";
    $("shoppingItem").focus();
  }
  $("shoppingAddBtn").addEventListener("click", shoppingAdd);
  $("shoppingClearBtn").addEventListener("click", shoppingClear);
  $("shoppingExportBtn").addEventListener("click", exportData);
  $("shoppingImportBtn").addEventListener("click", importData);
  $("shoppingWipeBtn").addEventListener("click", shoppingWipe);
  
  function renderShopping(){
    const remaining = shopping.filter(s => !s.bought).length;
    $("shoppingCount").textContent = String(remaining);
    $("shoppingList").innerHTML = "";
    $("shoppingEmpty").style.display = shopping.some(s => !s.bought) ? "none" : "block";
    
    shopping.filter(s => !s.bought).sort((a,b) => ({high:3, medium:2, low:1}[b.priority] || 0) - ({high:3, medium:2, low:1}[a.priority] || 0)).forEach(s => {
      const div = document.createElement("div");
      div.className = "item";
      div.innerHTML = `
        <div>
          <div style="font-weight:950">${escapeHtml(s.item)}</div>
          <div class="meta">${s.category} • ${s.priority}</div>
        </div>
        <div class="actions">
          <button class="iconbtn" data-act="buy">✓</button>
          <button class="iconbtn" data-act="del">${T[lang].actions.delete}</button>
        </div>
      `;
      div.querySelector('[data-act="buy"]').addEventListener("click", () => shoppingToggle(s.id));
      div.querySelector('[data-act="del"]').addEventListener("click", () => shoppingDelete(s.id));
      $("shoppingList").appendChild(div);
    });
  }

  // -------- Budget
  let budget = load(K.budget, {});
  function budgetSet(){
    const month = $("budgetFilterMonth").value || nowMonthISO();
    const amount = Number($("budgetAmount").value) || 0;
    if(amount <= 0) { alert(T[lang].alerts.needBudget); return; }
    budget[month] = amount;
    save(K.budget, budget);
    showToast(T[lang].alerts.saved);
    renderBudget();
    renderDashboard();
  }
  function budgetWipe(){
    if(!confirm(T[lang].alerts.wipeConfirm)) return;
    budget = {};
    save(K.budget, budget);
    renderBudget();
    renderDashboard();
  }
  $("budgetSaveBtn").addEventListener("click", budgetSet);
  $("budgetWipeBtn").addEventListener("click", budgetWipe);
  $("budgetExportBtn").addEventListener("click", exportData);
  $("budgetImportBtn").addEventListener("click", importData);
  $("budgetFilterMonth").value = nowMonthISO();

  function renderBudget(){
    const month = $("budgetFilterMonth").value || nowMonthISO();
    const monthBudget = budget[month] || 0;
    const monthExpenses = expenses.filter(e => (e.date || "").startsWith(month));
    const spent = monthExpenses.reduce((s,e) => s + (Number(e.amount)||0), 0);
    const remaining = monthBudget - spent;
    const percent = monthBudget > 0 ? Math.round((spent/monthBudget)*100) : 0;

    $("budgetCount").textContent = String(monthExpenses.length);

    $("budgetAnalysis").innerHTML = `
      <div style="margin-bottom:8px"><strong>${T[lang].budget.monthlyBudget}</strong> ${monthBudget.toFixed(2)}€</div>
      <div style="margin-bottom:8px"><strong>${T[lang].budget.spent}</strong> ${spent.toFixed(2)}€ (${percent}%)</div>
      <div style="margin-bottom:12px"><strong>${T[lang].budget.remaining}</strong> <span style="color:${remaining >= 0 ? 'var(--ok)' : 'var(--danger)'}">${remaining.toFixed(2)}€</span></div>
      <div style="background:rgba(255,255,255,.05);height:6px;border-radius:3px;overflow:hidden">
        <div style="background:var(--primary);height:100%;width:${Math.min(100,percent)}%;border-radius:3px"></div>
      </div>
    `;
  }

  // -------- Dashboard
  function renderDashboard(){
    expenses = load(K.expenses, []);
    shopping = load(K.shopping, []);
    budget = load(K.budget, {});
    
    $("dashDate").textContent = new Date().toLocaleDateString(lang === 'ar' ? 'ar' : lang === 'fi' ? 'fi-FI' : 'en-US', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'});

    const today = todayISO();
    const expensesToday = expenses.filter(e => e.date === today);
    const totalToday = expensesToday.reduce((s,e) => s + (Number(e.amount)||0), 0);
    
    const month = nowMonthISO();
    const monthExpenses = expenses.filter(e => (e.date || "").startsWith(month));
    const monthTotal = monthExpenses.reduce((s,e) => s + (Number(e.amount)||0), 0);
    const monthBudget = budget[month] || 0;
    const remaining = monthBudget - monthTotal;

    $("dashboardStats").innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px">
        <div style="background:rgba(255,255,255,.05);padding:10px;border-radius:10px;text-align:center">
          <div style="font-size:20px;font-weight:950">💶</div>
          <div style="font-size:12px;color:var(--muted)">${T[lang].dashboard.todaysSpending}</div>
          <div style="font-size:18px;font-weight:950">${totalToday.toFixed(2)}€</div>
        </div>
        <div style="background:rgba(255,255,255,.05);padding:10px;border-radius:10px;text-align:center">
          <div style="font-size:20px;font-weight:950">📊</div>
          <div style="font-size:12px;color:var(--muted)">${T[lang].dashboard.thisMonth}</div>
          <div style="font-size:18px;font-weight:950">${monthTotal.toFixed(2)}€</div>
        </div>
        <div style="background:rgba(255,255,255,.05);padding:10px;border-radius:10px;text-align:center">
          <div style="font-size:20px;font-weight:950">🛍️</div>
          <div style="font-size:12px;color:var(--muted)">${T[lang].dashboard.toShop}</div>
          <div style="font-size:18px;font-weight:950">${shopping.filter(s => !s.bought).length}</div>
        </div>
        <div style="background:rgba(255,255,255,.05);padding:10px;border-radius:10px;text-align:center">
          <div style="font-size:20px;font-weight:950">📈</div>
          <div style="font-size:12px;color:var(--muted)">${T[lang].dashboard.budgetLeft}</div>
          <div style="font-size:18px;font-weight:950;color:${remaining >= 0 ? 'var(--ok)' : 'var(--danger)'}">${remaining.toFixed(2)}€</div>
        </div>
      </div>
    `;

    const toBuy = shopping.filter(s => !s.bought).sort((a,b) => ({high:3, medium:2, low:1}[b.priority] || 0) - ({high:3, medium:2, low:1}[a.priority] || 0));
    $("dashShoppingCount").textContent = String(toBuy.length);
    
    if(toBuy.length > 0) {
      $("dashShoppingList").innerHTML = toBuy.slice(0, 5).map(s => 
        `<div style="padding:6px;border-left:3px solid var(--primary);margin-bottom:4px;">
          <div style="font-weight:700">${escapeHtml(s.item)}</div>
          <div style="font-size:11px;color:var(--muted)">${s.category} • ${s.priority}</div>
        </div>`
      ).join("") + (toBuy.length > 5 ? `<div style="color:var(--muted);font-size:11px;margin-top:8px">+${toBuy.length - 5} ${T[lang].actions.more}</div>` : "");
    } else {
     $("dashShoppingList").innerHTML = `<div style="color:var(--muted);font-size:12px">${T[lang].dashboard.shoppingComplete}</div>`;
    }

    const percent = monthBudget > 0 ? Math.round((monthTotal/monthBudget)*100) : 0;
    $("dashBudgetStatus").innerHTML = `
      <div>💰 ${T[lang].budget.monthlyBudget} <strong>${monthBudget.toFixed(2)}€</strong></div>
      <div>💸 ${T[lang].budget.spent} <strong>${monthTotal.toFixed(2)}€</strong> (${percent}%)</div>
      <div>📌 ${T[lang].exp.total} <strong>${monthExpenses.length}</strong></div>
      <div style="margin-top:8px;background:rgba(255,255,255,.05);height:6px;border-radius:3px;overflow:hidden">
        <div style="background:${percent > 90 ? 'var(--danger)' : percent > 70 ? '#ff9800' : 'var(--ok)'}; height:100%;width:${Math.min(100,percent)}%;border-radius:3px"></div>
      </div>
    `;

    const topCategories = monthExpenses.reduce((acc, e) => {
      const existing = acc.find(x => x.name === e.name);
      if(existing) existing.amount += Number(e.amount)||0;
      else acc.push({name: e.name, amount: Number(e.amount)||0});
      return acc;
    }, []).sort((a,b) => b.amount - a.amount).slice(0, 5);

    $("dashMonthlyTotal").textContent = formatMoney(monthTotal);
    $("dashExpensesBreakdown").innerHTML = topCategories.length > 0 ?
      topCategories.map(cat => 
        `<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.05)">
          <div style="font-size:12px">${escapeHtml(cat.name)}</div>
          <div style="font-weight:700">${cat.amount.toFixed(2)}€</div>
        </div>`
      ).join("") :
      `<div style="color:var(--muted);font-size:12px">${T[lang].dashboard.noExpensesMonth}</div>`;
  }

  function renderAll(){
    renderDashboard();
    renderExpenses();
    renderShopping();
    renderBudget();
  }

  // -------- Helpers
  function escapeHtml(str){
    return String(str ?? "")
      .replaceAll("&","&amp;")
      .replaceAll("<","&lt;")
      .replaceAll(">","&gt;")
      .replaceAll('"',"&quot;")
      .replaceAll("'","&#039;");
  }

  function showToast(msg){
    const toast = document.createElement("div");
    toast.style.cssText = "position:fixed;bottom:20px;right:20px;background:var(--primary);color:#071022;padding:12px 16px;border-radius:12px;font-weight:900;z-index:9999;animation:slideIn 0.3s ease";
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  }

  function exportData(){
    const allData = {
      expenses,
      shopping,
      budget
    };
    const json = JSON.stringify(allData, null, 2);
    const blob = new Blob([json], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "budget_backup_" + new Date().toISOString().split("T")[0] + ".json";
    a.click();
    URL.revokeObjectURL(url);
    showToast(T[lang].alerts.saved);
  }

  function importData(){
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if(!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try{
          const data = JSON.parse(ev.target?.result || "{}");
          if(data.expenses) { expenses = data.expenses; save(K.expenses, expenses); }
          if(data.shopping) { shopping = data.shopping; save(K.shopping, shopping); }
          if(data.budget) { budget = data.budget; save(K.budget, budget); }
          renderAll();
          showToast(T[lang].alerts.saved);
        }catch(err){
          alert(T[lang].alerts.importError + " " + err.message);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }

  // -------- Language buttons
  $("langFI").addEventListener("click", ()=>setLang("fi"));
  $("langEN").addEventListener("click", ()=>setLang("en"));
  $("langAR").addEventListener("click", ()=>setLang("ar"));

  // Start
  setLang(lang);
  showPage(currentPage);
  renderAll();
})();
