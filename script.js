// إعداد بيانات البوت لتليغرام
const TELEGRAM_TOKEN = "8080174902:AAHX9XK3_Yd-TkY8Vq2LBzK8BGCWFmqy17o";
const CHAT_ID = "7203065656";

// ****** الصفحة الرئيسية ******

// إظهار الصفحة الرئيسية بعد إدخال الاسم الكامل
function showMainPage() {
    const fullName = document.getElementById("fullName").value.trim();
    if (fullName !== "") {
        document.getElementById("intro-section").classList.add("hidden");
        document.getElementById("main-section").classList.remove("hidden");

        // حفظ الاسم في التخزين المحلي
        localStorage.setItem("userName", fullName);
    } else {
        alert("الرجاء إدخال الاسم الكامل!");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const userName = localStorage.getItem("userName");

    if (!userName) {
        // إذا لم يتم إدخال الاسم، يتم إعادة التوجيه إلى صفحة إدخال الاسم
        window.location.href = "form.html";
    } else {
        // عرض الاسم الكامل في رسالة الترحيب
        const welcomeMessage = document.getElementById("welcome-message");
        welcomeMessage.textContent = `مرحباً، ${userName}!`;
    }
});

// إضافة تعليق جديد
function addTestimonial() {
    const commentText = document.getElementById("new-comment").value.trim();
    if (commentText === "") {
        alert("الرجاء كتابة تعليق!");
        return;
    }

    const commentsContainer = document.getElementById("comments-container");

    // إنشاء تعليق جديد
    const commentDiv = document.createElement("div");
    commentDiv.className = "comment";

    const iconDiv = document.createElement("div");
    iconDiv.className = "icon";
    iconDiv.textContent = "👤";

    const textDiv = document.createElement("div");
    textDiv.className = "text";
    textDiv.textContent = commentText;

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "حذف";
    deleteBtn.onclick = () => {
        commentsContainer.removeChild(commentDiv);
    };

    commentDiv.appendChild(iconDiv);
    commentDiv.appendChild(textDiv);
    commentDiv.appendChild(deleteBtn);
    commentsContainer.appendChild(commentDiv);

    // تفريغ النص
    document.getElementById("new-comment").value = "";
}

// إضافة تعليقات إيجابية مسبقة
document.addEventListener("DOMContentLoaded", () => {
    const predefinedComments = [
        { name: "محمد", comment: "موقع رائع جداً!" },
        { name: "فاطمة", comment: "أحببت التصميم البسيط!" },
        { name: "علي", comment: "تجربة استخدام مذهلة!" }
    ];

    const commentsContainer = document.getElementById("comments-container");
    predefinedComments.forEach(({ name, comment }) => {
        const commentDiv = document.createElement("div");
        commentDiv.className = "comment";

        const iconDiv = document.createElement("div");
        iconDiv.className = "icon";
        iconDiv.textContent = "👤";

        const textDiv = document.createElement("div");
        textDiv.className = "text";
        textDiv.textContent = `${name}: ${comment}`;

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.textContent = "حذف";
        deleteBtn.onclick = () => {
            commentsContainer.removeChild(commentDiv);
        };

        commentDiv.appendChild(iconDiv);
        commentDiv.appendChild(textDiv);
        commentDiv.appendChild(deleteBtn);
        commentsContainer.appendChild(commentDiv);
    });
});

// ****** صفحة الاستمارة ******

// إرسال البيانات إلى بوت تليغرام
function sendToTelegram(data) {
    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
    const message = `
📝 *استمارة تسجيل جديدة:*
- الاسم الكامل: ${data.name}
- رقم الهاتف: ${data.phone}
- المستوى: ${data.level}
- المادة: ${data.subject}
- المبلغ الإجمالي: ${data.amount} DH
`;

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            chat_id: CHAT_ID,
            text: message,
            parse_mode: "Markdown",
        }),
    })
        .then((response) => {
            if (response.ok) {
                alert("تم إرسال البيانات بنجاح إلى البوت!");
            } else {
                alert("حدث خطأ أثناء إرسال البيانات إلى البوت.");
            }
        })
        .catch((error) => {
            alert("تعذر الاتصال بالبوت. يرجى التحقق من الإعدادات.");
            console.error("Telegram Error:", error);
        });
}

// حساب المبلغ الإجمالي في صفحة الاستمارة
function calculateTotalAmount() {
    const level = document.getElementById('level').value;
    const subject = document.getElementById('subject').value;
    let amount = 0;

    if (level === '1st') {
        amount = (subject === 'both') ? 200 : 150;
    } else if (level === '2nd') {
        amount = (subject === 'both') ? 300 : 200;
    }

    document.getElementById('totalAmount').innerText = `المبلغ الإجمالي: ${amount} DH`;
}

// التعامل مع إرسال الاستمارة
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registrationForm");
    if (form) {
        form.addEventListener("change", calculateTotalAmount);

        form.addEventListener("submit", (event) => {
            event.preventDefault();

            // جمع البيانات من الحقول
            const name = document.getElementById("name").value.trim();
            const phone = document.getElementById("phone").value.trim();
            const level = document.getElementById("level").value;
            const subject = document.getElementById("subject").value;
            const amountElement = document.getElementById("totalAmount").innerText;
            const amount = parseInt(amountElement.match(/\d+/)[0]); // استخراج الرقم من النص

            if (name && phone && level && subject) {
                const formData = {
                    name,
                    phone,
                    level,
                    subject,
                    amount,
                };

                // إرسال البيانات إلى تليغرام
                sendToTelegram(formData);

                // إعادة تعيين الحقول بعد الإرسال
                form.reset();
                document.getElementById("totalAmount").innerText = "";
            } else {
                alert("الرجاء ملء جميع الحقول.");
            }
        });
    }
});
