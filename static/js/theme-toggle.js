// الكود الخاص بتبديل الموضوع بين الفاتح والداكن
document.addEventListener('DOMContentLoaded', function () {
    const themeToggle = document.getElementById('theme-toggle'); // العنصر الذي سيقوم بالتبديل
    const currentTheme = localStorage.getItem('theme') || 'light'; // تحديد الموضوع الافتراضي من التخزين المحلي

    // تعيين الموضوع الحالي عند تحميل الصفحة
    document.body.classList.add(currentTheme);

    // التبديل بين الفاتح والداكن عند النقر
    themeToggle.addEventListener('click', function () {
        const currentTheme = document.body.classList.contains('dark') ? 'light' : 'dark';
        document.body.classList.remove('light', 'dark'); // إزالة الموضوعات القديمة
        document.body.classList.add(currentTheme); // إضافة الموضوع الجديد

        // حفظ الموضوع الحالي في التخزين المحلي
        localStorage.setItem('theme', currentTheme);
    });
});
