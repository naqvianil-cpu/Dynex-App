// English is the source of truth for shape -- every other language is
// typed against it, so a missing key is a compile error, not a runtime
// blank. Translations here are machine-assisted for common short UI
// phrases; before a production rollout, have a native speaker of each
// language review this file (see README "Language & translation").

export interface Strings {
  common: {
    continue: string;
    cancel: string;
    save: string;
    retry: string;
    loading: string;
    signOut: string;
    back: string;
    ok: string;
  };
  languageSelect: {
    title: string;
    subtitle: string;
    continueButton: string;
  };
  login: {
    title: string;
    subtitle: string;
    workerId: string;
    pin: string;
    signIn: string;
    noAccount: string;
    register: string;
    forgotPin: string;
    invalidCredentials: string;
  };
  register: {
    title: string;
    fullName: string;
    workerId: string;
    project: string;
    phone: string;
    phoneOptional: string;
    pin: string;
    pinHint: string;
    confirmPin: string;
    submit: string;
    haveAccount: string;
    signIn: string;
    pinMismatch: string;
    pinLength: string;
    workerIdTaken: string;
    genericError: string;
  };
  myCases: {
    title: string;
    empty: string;
    reportIssue: string;
    refreshHint: string;
  };
  dashboard: {
    title: string;
    greeting: string;
    overview: string;
    totalCases: string;
    openCases: string;
    resolvedCases: string;
    recentCases: string;
    viewAll: string;
    colRef: string;
    colCategory: string;
    colStatus: string;
    colDate: string;
    reportIssue: string;
    emptyState: string;
    feedbackTitle: string;
    feedbackQuestion: string;
    feedbackWasClosedOn: string;
    moodVeryHappy: string;
    moodHappy: string;
    moodOk: string;
    moodSad: string;
  };
  submit: {
    title: string;
    subtitle: string;
    category: string;
    description: string;
    descriptionPlaceholder: string;
    urgency: string;
    confidentiality: string;
    confidentialityStandard: string;
    confidentialityConfidential: string;
    confidentialityAnonymous: string;
    submitButton: string;
    successTitle: string;
    successMessage: string;
    genericError: string;
  };
  caseDetail: {
    status: string;
    category: string;
    submitted: string;
    updates: string;
    noUpdates: string;
    resolvedQuestion: string;
    yes: string;
    no: string;
    satisfaction: string;
    comments: string;
    commentsPlaceholder: string;
    sendFeedback: string;
    feedbackThanks: string;
    alreadyGaveFeedback: string;
  };
  evidence: {
    title: string;
    subtitle: string;
    selectCase: string;
    noCases: string;
    addPhoto: string;
    takePhoto: string;
    chooseFromLibrary: string;
    uploading: string;
    uploadError: string;
    noAttachments: string;
    submitHint: string;
  };
  settings: {
    title: string;
    language: string;
    notifications: string;
    notificationsOn: string;
    notificationsOff: string;
    signOutConfirmTitle: string;
    signOutConfirmMessage: string;
    version: string;
  };
  statuses: {
    new: string;
    acknowledged: string;
    inProgress: string;
    onHold: string;
    escalated: string;
    resolved: string;
    partiallyClosed: string;
    closed: string;
  };
  priorities: {
    low: string;
    medium: string;
    high: string;
    critical: string;
  };
  categories: {
    accommodation: string;
    food: string;
    salary: string;
    overtime: string;
    safety: string;
    medical: string;
    documentation: string;
    leave: string;
    camp: string;
    finalExit: string;
    other: string;
  };
}

export const en: Strings = {
  common: {
    continue: 'Continue',
    cancel: 'Cancel',
    save: 'Save',
    retry: 'Try again',
    loading: 'Loading…',
    signOut: 'Sign out',
    back: 'Back',
    ok: 'OK',
  },
  languageSelect: {
    title: 'Choose your language',
    subtitle: 'You can change this later in Settings.',
    continueButton: 'Continue',
  },
  login: {
    title: 'Workers Welfare',
    subtitle: 'DYNEX Grievance Registry',
    workerId: 'Worker ID',
    pin: '6-digit PIN',
    signIn: 'Sign in',
    noAccount: "New here?",
    register: 'Create an account',
    forgotPin: 'Forgot your PIN? Ask your Welfare Officer to reset it.',
    invalidCredentials: 'Worker ID or PIN is incorrect.',
  },
  register: {
    title: 'Create your account',
    fullName: 'Full name',
    workerId: 'Worker ID',
    project: 'Project / site',
    phone: 'Phone number',
    phoneOptional: 'Phone number (optional)',
    pin: 'Choose a 6-digit PIN',
    pinHint: 'Numbers only, 6 digits. Remember this -- you will use it every time you sign in.',
    confirmPin: 'Confirm PIN',
    submit: 'Register',
    haveAccount: 'Already have an account?',
    signIn: 'Sign in',
    pinMismatch: 'PINs do not match.',
    pinLength: 'PIN must be exactly 6 digits.',
    workerIdTaken: 'This Worker ID is already registered. Try signing in instead.',
    genericError: 'Could not create your account. Please try again.',
  },
  myCases: {
    title: 'My Cases',
    empty: "You haven't reported anything yet.",
    reportIssue: 'Report an issue',
    refreshHint: 'Pull down to refresh.',
  },
  dashboard: {
    title: 'Dashboard',
    greeting: 'Welcome back',
    overview: 'Overview',
    totalCases: 'Total cases',
    openCases: 'Open',
    resolvedCases: 'Resolved',
    recentCases: 'Recent cases',
    viewAll: 'View all',
    colRef: 'Reference',
    colCategory: 'Category',
    colStatus: 'Status',
    colDate: 'Date',
    reportIssue: 'Report an issue',
    emptyState: 'You haven\'t reported anything yet.',
    feedbackTitle: 'Feedback',
    feedbackQuestion: 'How was your experience?',
    feedbackWasClosedOn: 'was closed on',
    moodVeryHappy: 'Very Happy',
    moodHappy: 'Happy',
    moodOk: 'Just Fine',
    moodSad: 'Sad',
  },
  submit: {
    title: 'Report an issue',
    subtitle: 'Your Welfare Officer will see this in English, whatever language you write in.',
    category: 'What kind of issue?',
    description: 'Describe what happened',
    descriptionPlaceholder: 'Write in your own language...',
    urgency: 'How urgent is this?',
    confidentiality: 'Who can see your name?',
    confidentialityStandard: 'Welfare team (normal)',
    confidentialityConfidential: 'Keep it confidential',
    confidentialityAnonymous: 'Submit anonymously',
    submitButton: 'Submit',
    successTitle: 'Submitted',
    successMessage: 'Your case has been submitted.',
    genericError: 'Could not submit your case. Please try again.',
  },
  caseDetail: {
    status: 'Status',
    category: 'Category',
    submitted: 'Submitted',
    updates: 'Updates',
    noUpdates: 'No updates yet.',
    resolvedQuestion: 'Was this resolved?',
    yes: 'Yes',
    no: 'No',
    satisfaction: 'How satisfied are you?',
    comments: 'Any comments? (optional)',
    commentsPlaceholder: 'Tell us more...',
    sendFeedback: 'Send feedback',
    feedbackThanks: 'Thank you for your feedback.',
    alreadyGaveFeedback: 'You already gave feedback on this case.',
  },
  evidence: {
    title: 'Evidence',
    subtitle: 'Attach photos to support one of your cases.',
    selectCase: 'Choose a case',
    noCases: "You don't have any cases yet. Submit a grievance first.",
    addPhoto: 'Add photo',
    takePhoto: 'Take photo',
    chooseFromLibrary: 'Choose from library',
    uploading: 'Uploading…',
    uploadError: 'Could not upload photo. Please try again.',
    noAttachments: 'No photos added yet.',
    submitHint: 'Optional — add photos to help your Welfare Officer understand the issue.',
  },
  settings: {
    title: 'Settings',
    language: 'Language',
    notifications: 'Push notifications',
    notificationsOn: 'On -- you’ll be notified when your case status changes.',
    notificationsOff: 'Off',
    signOutConfirmTitle: 'Sign out',
    signOutConfirmMessage: 'Are you sure you want to sign out?',
    version: 'Workers Welfare',
  },
  statuses: {
    new: 'New',
    acknowledged: 'Acknowledged',
    inProgress: 'In Progress',
    onHold: 'On Hold',
    escalated: 'Escalated',
    resolved: 'Resolved',
    partiallyClosed: 'Partially Closed',
    closed: 'Closed',
  },
  priorities: {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    critical: 'Critical',
  },
  categories: {
    accommodation: 'Accommodation',
    food: 'Food',
    salary: 'Salary',
    overtime: 'Overtime',
    safety: 'Safety',
    medical: 'Medical',
    documentation: 'Documentation',
    leave: 'Leave',
    camp: 'Camp',
    finalExit: 'Final Exit / Ticket',
    other: 'Other',
  },
};

export const ur: Strings = {
  common: {
    continue: 'جاری رکھیں',
    cancel: 'منسوخ کریں',
    save: 'محفوظ کریں',
    retry: 'دوبارہ کوشش کریں',
    loading: 'لوڈ ہو رہا ہے…',
    signOut: 'سائن آؤٹ',
    back: 'واپس',
    ok: 'ٹھیک ہے',
  },
  languageSelect: {
    title: 'اپنی زبان منتخب کریں',
    subtitle: 'آپ بعد میں سیٹنگز میں اسے بدل سکتے ہیں۔',
    continueButton: 'جاری رکھیں',
  },
  login: {
    title: 'ورکرز ویلفیئر',
    subtitle: 'ڈائنیکس شکایت رجسٹری',
    workerId: 'ورکر آئی ڈی',
    pin: '6 ہندسوں کا PIN',
    signIn: 'سائن ان کریں',
    noAccount: 'نئے ہیں؟',
    register: 'اکاؤنٹ بنائیں',
    forgotPin: 'PIN بھول گئے؟ اپنے ویلفیئر آفیسر سے ری سیٹ کروائیں۔',
    invalidCredentials: 'ورکر آئی ڈی یا PIN غلط ہے۔',
  },
  register: {
    title: 'اپنا اکاؤنٹ بنائیں',
    fullName: 'پورا نام',
    workerId: 'ورکر آئی ڈی',
    project: 'پراجیکٹ / سائٹ',
    phone: 'فون نمبر',
    phoneOptional: 'فون نمبر (اختیاری)',
    pin: '6 ہندسوں کا PIN منتخب کریں',
    pinHint: 'صرف ہندسے، 6 ہندسے۔ اسے یاد رکھیں -- ہر بار سائن ان کے لیے یہی استعمال ہوگا۔',
    confirmPin: 'PIN کی تصدیق کریں',
    submit: 'رجسٹر کریں',
    haveAccount: 'پہلے سے اکاؤنٹ ہے؟',
    signIn: 'سائن ان کریں',
    pinMismatch: 'PIN مماثل نہیں ہیں۔',
    pinLength: 'PIN بالکل 6 ہندسوں کا ہونا چاہیے۔',
    workerIdTaken: 'یہ ورکر آئی ڈی پہلے سے رجسٹرڈ ہے۔ براہ کرم سائن ان کریں۔',
    genericError: 'اکاؤنٹ نہیں بن سکا۔ دوبارہ کوشش کریں۔',
  },
  myCases: {
    title: 'میرے کیسز',
    empty: 'آپ نے ابھی تک کوئی شکایت درج نہیں کی۔',
    reportIssue: 'مسئلہ رپورٹ کریں',
    refreshHint: 'تازہ کرنے کے لیے نیچے کھینچیں۔',
  },
  dashboard: {
    title: 'ڈیش بورڈ',
    greeting: 'خوش آمدید',
    overview: 'مجموعی جائزہ',
    totalCases: 'کل کیسز',
    openCases: 'جاری',
    resolvedCases: 'حل شدہ',
    recentCases: 'حالیہ کیسز',
    viewAll: 'سب دیکھیں',
    colRef: 'حوالہ نمبر',
    colCategory: 'زمرہ',
    colStatus: 'صورتحال',
    colDate: 'تاریخ',
    reportIssue: 'مسئلہ رپورٹ کریں',
    emptyState: 'آپ نے ابھی تک کوئی شکایت درج نہیں کی۔',
    feedbackTitle: 'رائے',
    feedbackQuestion: 'آپ کا تجربہ کیسا رہا؟',
    feedbackWasClosedOn: 'کو بند کیا گیا',
    moodVeryHappy: 'بہت خوش',
    moodHappy: 'خوش',
    moodOk: 'ٹھیک ٹھاک',
    moodSad: 'ناخوش',
  },
  submit: {
    title: 'مسئلہ رپورٹ کریں',
    subtitle: 'آپ جو بھی زبان میں لکھیں، آپ کا ویلفیئر آفیسر اسے انگریزی میں دیکھے گا۔',
    category: 'کس قسم کا مسئلہ ہے؟',
    description: 'جو ہوا اسے بیان کریں',
    descriptionPlaceholder: 'اپنی زبان میں لکھیں...',
    urgency: 'یہ کتنا فوری ہے؟',
    confidentiality: 'آپ کا نام کون دیکھ سکتا ہے؟',
    confidentialityStandard: 'ویلفیئر ٹیم (عام)',
    confidentialityConfidential: 'خفیہ رکھیں',
    confidentialityAnonymous: 'گمنام طور پر جمع کرائیں',
    submitButton: 'جمع کرائیں',
    successTitle: 'جمع ہو گیا',
    successMessage: 'آپ کا کیس جمع کرا دیا گیا ہے۔',
    genericError: 'کیس جمع نہیں ہو سکا۔ دوبارہ کوشش کریں۔',
  },
  caseDetail: {
    status: 'صورتحال',
    category: 'قسم',
    submitted: 'جمع کرایا گیا',
    updates: 'اپڈیٹس',
    noUpdates: 'ابھی تک کوئی اپڈیٹ نہیں۔',
    resolvedQuestion: 'کیا یہ حل ہو گیا؟',
    yes: 'ہاں',
    no: 'نہیں',
    satisfaction: 'آپ کتنے مطمئن ہیں؟',
    comments: 'کوئی تبصرہ؟ (اختیاری)',
    commentsPlaceholder: 'مزید بتائیں...',
    sendFeedback: 'رائے بھیجیں',
    feedbackThanks: 'آپ کی رائے کا شکریہ۔',
    alreadyGaveFeedback: 'آپ اس کیس پر پہلے ہی رائے دے چکے ہیں۔',
  },
  evidence: {
    title: 'شواہد',
    subtitle: 'اپنے کسی کیس کی حمایت کے لیے تصاویر منسلک کریں۔',
    selectCase: 'کیس منتخب کریں',
    noCases: 'ابھی آپ کا کوئی کیس نہیں ہے۔ پہلے شکایت جمع کرائیں۔',
    addPhoto: 'تصویر شامل کریں',
    takePhoto: 'تصویر لیں',
    chooseFromLibrary: 'لائبریری سے منتخب کریں',
    uploading: 'اپ لوڈ ہو رہا ہے…',
    uploadError: 'تصویر اپ لوڈ نہیں ہو سکی۔ دوبارہ کوشش کریں۔',
    noAttachments: 'ابھی تک کوئی تصویر شامل نہیں کی گئی۔',
    submitHint: 'اختیاری — اپنے ویلفیئر آفیسر کو مسئلہ سمجھنے میں مدد کے لیے تصاویر شامل کریں۔',
  },
  settings: {
    title: 'سیٹنگز',
    language: 'زبان',
    notifications: 'پش نوٹیفیکیشنز',
    notificationsOn: 'آن -- جب آپ کے کیس کی صورتحال بدلے گی تو آپ کو مطلع کیا جائے گا۔',
    notificationsOff: 'آف',
    signOutConfirmTitle: 'سائن آؤٹ',
    signOutConfirmMessage: 'کیا آپ واقعی سائن آؤٹ کرنا چاہتے ہیں؟',
    version: 'ورکرز ویلفیئر',
  },
  statuses: {
    new: 'نیا',
    acknowledged: 'تسلیم شدہ',
    inProgress: 'زیر عمل',
    onHold: 'روکا گیا',
    escalated: 'بڑھایا گیا',
    resolved: 'حل ہو گیا',
    partiallyClosed: 'جزوی طور پر بند',
    closed: 'بند',
  },
  priorities: {
    low: 'کم',
    medium: 'درمیانہ',
    high: 'زیادہ',
    critical: 'انتہائی نازک',
  },
  categories: {
    accommodation: 'رہائش',
    food: 'کھانا',
    salary: 'تنخواہ',
    overtime: 'اوور ٹائم',
    safety: 'حفاظت',
    medical: 'طبی',
    documentation: 'دستاویزات',
    leave: 'چھٹی',
    camp: 'کیمپ',
    finalExit: 'فائنل ایگزٹ / ٹکٹ',
    other: 'دیگر',
  },
};

export const ar: Strings = {
  common: {
    continue: 'متابعة',
    cancel: 'إلغاء',
    save: 'حفظ',
    retry: 'إعادة المحاولة',
    loading: 'جارٍ التحميل…',
    signOut: 'تسجيل الخروج',
    back: 'رجوع',
    ok: 'حسناً',
  },
  languageSelect: {
    title: 'اختر لغتك',
    subtitle: 'يمكنك تغييرها لاحقاً من الإعدادات.',
    continueButton: 'متابعة',
  },
  login: {
    title: 'رعاية العمال',
    subtitle: 'سجل شكاوى داينكس',
    workerId: 'رقم العامل',
    pin: 'رمز مكوّن من 6 أرقام',
    signIn: 'تسجيل الدخول',
    noAccount: 'مستخدم جديد؟',
    register: 'إنشاء حساب',
    forgotPin: 'نسيت الرمز؟ اطلب من مسؤول الرعاية إعادة تعيينه.',
    invalidCredentials: 'رقم العامل أو الرمز غير صحيح.',
  },
  register: {
    title: 'أنشئ حسابك',
    fullName: 'الاسم الكامل',
    workerId: 'رقم العامل',
    project: 'المشروع / الموقع',
    phone: 'رقم الهاتف',
    phoneOptional: 'رقم الهاتف (اختياري)',
    pin: 'اختر رمزاً من 6 أرقام',
    pinHint: 'أرقام فقط، 6 أرقام. تذكّره -- ستستخدمه في كل مرة تسجّل فيها الدخول.',
    confirmPin: 'تأكيد الرمز',
    submit: 'تسجيل',
    haveAccount: 'لديك حساب بالفعل؟',
    signIn: 'تسجيل الدخول',
    pinMismatch: 'الرمزان غير متطابقين.',
    pinLength: 'يجب أن يتكوّن الرمز من 6 أرقام بالضبط.',
    workerIdTaken: 'رقم العامل هذا مسجّل بالفعل. حاول تسجيل الدخول بدلاً من ذلك.',
    genericError: 'تعذّر إنشاء حسابك. حاول مرة أخرى.',
  },
  myCases: {
    title: 'قضاياي',
    empty: 'لم تُبلّغ عن أي شيء حتى الآن.',
    reportIssue: 'الإبلاغ عن مشكلة',
    refreshHint: 'اسحب للأسفل للتحديث.',
  },
  dashboard: {
    title: 'لوحة المعلومات',
    greeting: 'مرحبًا بعودتك',
    overview: 'نظرة عامة',
    totalCases: 'إجمالي الحالات',
    openCases: 'قيد المعالجة',
    resolvedCases: 'تم الحل',
    recentCases: 'الحالات الأخيرة',
    viewAll: 'عرض الكل',
    colRef: 'الرقم المرجعي',
    colCategory: 'الفئة',
    colStatus: 'الحالة',
    colDate: 'التاريخ',
    reportIssue: 'الإبلاغ عن مشكلة',
    emptyState: 'لم تقم بالإبلاغ عن أي شيء بعد.',
    feedbackTitle: 'الملاحظات',
    feedbackQuestion: 'كيف كانت تجربتك؟',
    feedbackWasClosedOn: 'أُغلقت في',
    moodVeryHappy: 'سعيد جدًا',
    moodHappy: 'سعيد',
    moodOk: 'عادي',
    moodSad: 'غير راضٍ',
  },
  submit: {
    title: 'الإبلاغ عن مشكلة',
    subtitle: 'سيرى مسؤول الرعاية هذا باللغة الإنجليزية، أياً كانت اللغة التي تكتب بها.',
    category: 'ما نوع المشكلة؟',
    description: 'صف ما حدث',
    descriptionPlaceholder: 'اكتب بلغتك الخاصة...',
    urgency: 'ما مدى إلحاح هذا الأمر؟',
    confidentiality: 'من يمكنه رؤية اسمك؟',
    confidentialityStandard: 'فريق الرعاية (عادي)',
    confidentialityConfidential: 'إبقاؤه سرياً',
    confidentialityAnonymous: 'تقديم بشكل مجهول',
    submitButton: 'إرسال',
    successTitle: 'تم الإرسال',
    successMessage: 'تم إرسال قضيتك.',
    genericError: 'تعذّر إرسال قضيتك. حاول مرة أخرى.',
  },
  caseDetail: {
    status: 'الحالة',
    category: 'الفئة',
    submitted: 'تاريخ التقديم',
    updates: 'التحديثات',
    noUpdates: 'لا توجد تحديثات بعد.',
    resolvedQuestion: 'هل تم حل هذه المشكلة؟',
    yes: 'نعم',
    no: 'لا',
    satisfaction: 'ما مدى رضاك؟',
    comments: 'أي ملاحظات؟ (اختياري)',
    commentsPlaceholder: 'أخبرنا المزيد...',
    sendFeedback: 'إرسال الملاحظات',
    feedbackThanks: 'شكراً على ملاحظاتك.',
    alreadyGaveFeedback: 'لقد قدّمت ملاحظاتك على هذه القضية بالفعل.',
  },
  evidence: {
    title: 'الأدلة',
    subtitle: 'أرفق صوراً لدعم إحدى قضاياك.',
    selectCase: 'اختر قضية',
    noCases: 'ليس لديك أي قضايا بعد. قدّم شكوى أولاً.',
    addPhoto: 'إضافة صورة',
    takePhoto: 'التقاط صورة',
    chooseFromLibrary: 'الاختيار من المعرض',
    uploading: 'جارٍ الرفع…',
    uploadError: 'تعذّر رفع الصورة. حاول مرة أخرى.',
    noAttachments: 'لم تتم إضافة أي صور بعد.',
    submitHint: 'اختياري — أضف صورًا لمساعدة مسؤول الرعاية على فهم المشكلة.',
  },
  settings: {
    title: 'الإعدادات',
    language: 'اللغة',
    notifications: 'الإشعارات',
    notificationsOn: 'مفعّلة -- سيتم إعلامك عند تغيّر حالة قضيتك.',
    notificationsOff: 'معطّلة',
    signOutConfirmTitle: 'تسجيل الخروج',
    signOutConfirmMessage: 'هل أنت متأكد أنك تريد تسجيل الخروج؟',
    version: 'رعاية العمال',
  },
  statuses: {
    new: 'جديدة',
    acknowledged: 'تم الاطلاع',
    inProgress: 'قيد المعالجة',
    onHold: 'قيد الانتظار',
    escalated: 'تم التصعيد',
    resolved: 'تم الحل',
    partiallyClosed: 'مغلقة جزئياً',
    closed: 'مغلقة',
  },
  priorities: {
    low: 'منخفضة',
    medium: 'متوسطة',
    high: 'عالية',
    critical: 'حرجة',
  },
  categories: {
    accommodation: 'السكن',
    food: 'الطعام',
    salary: 'الراتب',
    overtime: 'العمل الإضافي',
    safety: 'السلامة',
    medical: 'طبي',
    documentation: 'الوثائق',
    leave: 'الإجازة',
    camp: 'المخيم',
    finalExit: 'الخروج النهائي / التذكرة',
    other: 'أخرى',
  },
};

export const bn: Strings = {
  common: {
    continue: 'চালিয়ে যান',
    cancel: 'বাতিল',
    save: 'সংরক্ষণ করুন',
    retry: 'আবার চেষ্টা করুন',
    loading: 'লোড হচ্ছে…',
    signOut: 'সাইন আউট',
    back: 'পিছনে',
    ok: 'ঠিক আছে',
  },
  languageSelect: {
    title: 'আপনার ভাষা বেছে নিন',
    subtitle: 'আপনি পরে সেটিংসে এটি পরিবর্তন করতে পারবেন।',
    continueButton: 'চালিয়ে যান',
  },
  login: {
    title: 'ওয়ার্কার্স ওয়েলফেয়ার',
    subtitle: 'ডাইনেক্স অভিযোগ রেজিস্ট্রি',
    workerId: 'ওয়ার্কার আইডি',
    pin: '৬-সংখ্যার PIN',
    signIn: 'সাইন ইন করুন',
    noAccount: 'নতুন এসেছেন?',
    register: 'অ্যাকাউন্ট তৈরি করুন',
    forgotPin: 'PIN ভুলে গেছেন? আপনার ওয়েলফেয়ার অফিসারকে রিসেট করতে বলুন।',
    invalidCredentials: 'ওয়ার্কার আইডি বা PIN ভুল।',
  },
  register: {
    title: 'আপনার অ্যাকাউন্ট তৈরি করুন',
    fullName: 'পুরো নাম',
    workerId: 'ওয়ার্কার আইডি',
    project: 'প্রজেক্ট / সাইট',
    phone: 'ফোন নম্বর',
    phoneOptional: 'ফোন নম্বর (ঐচ্ছিক)',
    pin: '৬-সংখ্যার PIN বেছে নিন',
    pinHint: 'শুধু সংখ্যা, ৬ সংখ্যার। এটি মনে রাখুন -- প্রতিবার সাইন ইনে এটি ব্যবহার করবেন।',
    confirmPin: 'PIN নিশ্চিত করুন',
    submit: 'নিবন্ধন করুন',
    haveAccount: 'আগে থেকেই অ্যাকাউন্ট আছে?',
    signIn: 'সাইন ইন করুন',
    pinMismatch: 'PIN মিলছে না।',
    pinLength: 'PIN অবশ্যই ৬ সংখ্যার হতে হবে।',
    workerIdTaken: 'এই ওয়ার্কার আইডি ইতিমধ্যে নিবন্ধিত। সাইন ইন করার চেষ্টা করুন।',
    genericError: 'অ্যাকাউন্ট তৈরি করা যায়নি। আবার চেষ্টা করুন।',
  },
  myCases: {
    title: 'আমার কেস',
    empty: 'আপনি এখনও কিছু রিপোর্ট করেননি।',
    reportIssue: 'সমস্যা রিপোর্ট করুন',
    refreshHint: 'রিফ্রেশ করতে নিচে টানুন।',
  },
  dashboard: {
    title: 'ড্যাশবোর্ড',
    greeting: 'ফিরে আসার জন্য স্বাগতম',
    overview: 'সংক্ষিপ্ত বিবরণ',
    totalCases: 'মোট মামলা',
    openCases: 'চলমান',
    resolvedCases: 'সমাধান হয়েছে',
    recentCases: 'সাম্প্রতিক মামলা',
    viewAll: 'সব দেখুন',
    colRef: 'রেফারেন্স নম্বর',
    colCategory: 'ক্যাটাগরি',
    colStatus: 'অবস্থা',
    colDate: 'তারিখ',
    reportIssue: 'সমস্যা রিপোর্ট করুন',
    emptyState: 'আপনি এখনও কিছু রিপোর্ট করেননি।',
    feedbackTitle: 'মতামত',
    feedbackQuestion: 'আপনার অভিজ্ঞতা কেমন ছিল?',
    feedbackWasClosedOn: 'বন্ধ হয়েছে',
    moodVeryHappy: 'খুব খুশি',
    moodHappy: 'খুশি',
    moodOk: 'মোটামুটি',
    moodSad: 'অসন্তুষ্ট',
  },
  submit: {
    title: 'সমস্যা রিপোর্ট করুন',
    subtitle: 'আপনি যে ভাষায়ই লিখুন না কেন, আপনার ওয়েলফেয়ার অফিসার এটি ইংরেজিতে দেখবেন।',
    category: 'কী ধরনের সমস্যা?',
    description: 'কী ঘটেছে তা বর্ণনা করুন',
    descriptionPlaceholder: 'আপনার নিজের ভাষায় লিখুন...',
    urgency: 'এটি কতটা জরুরি?',
    confidentiality: 'আপনার নাম কে দেখতে পারবে?',
    confidentialityStandard: 'ওয়েলফেয়ার টিম (স্বাভাবিক)',
    confidentialityConfidential: 'গোপন রাখুন',
    confidentialityAnonymous: 'বেনামে জমা দিন',
    submitButton: 'জমা দিন',
    successTitle: 'জমা হয়েছে',
    successMessage: 'আপনার কেস জমা দেওয়া হয়েছে।',
    genericError: 'আপনার কেস জমা দেওয়া যায়নি। আবার চেষ্টা করুন।',
  },
  caseDetail: {
    status: 'অবস্থা',
    category: 'ধরন',
    submitted: 'জমা দেওয়া হয়েছে',
    updates: 'আপডেট',
    noUpdates: 'এখনও কোনো আপডেট নেই।',
    resolvedQuestion: 'এটি কি সমাধান হয়েছে?',
    yes: 'হ্যাঁ',
    no: 'না',
    satisfaction: 'আপনি কতটা সন্তুষ্ট?',
    comments: 'কোনো মন্তব্য? (ঐচ্ছিক)',
    commentsPlaceholder: 'আরও বলুন...',
    sendFeedback: 'মতামত পাঠান',
    feedbackThanks: 'আপনার মতামতের জন্য ধন্যবাদ।',
    alreadyGaveFeedback: 'আপনি ইতিমধ্যে এই কেসে মতামত দিয়েছেন।',
  },
  evidence: {
    title: 'প্রমাণ',
    subtitle: 'আপনার কোনো কেস সমর্থনে ছবি সংযুক্ত করুন।',
    selectCase: 'একটি কেস বেছে নিন',
    noCases: 'আপনার এখনও কোনো কেস নেই। প্রথমে একটি অভিযোগ জমা দিন।',
    addPhoto: 'ছবি যোগ করুন',
    takePhoto: 'ছবি তুলুন',
    chooseFromLibrary: 'লাইব্রেরি থেকে বেছে নিন',
    uploading: 'আপলোড হচ্ছে…',
    uploadError: 'ছবি আপলোড করা যায়নি। আবার চেষ্টা করুন।',
    noAttachments: 'এখনও কোনো ছবি যোগ করা হয়নি।',
    submitHint: 'ঐচ্ছিক — আপনার ওয়েলফেয়ার অফিসারকে সমস্যা বুঝতে সাহায্য করতে ছবি যোগ করুন।',
  },
  settings: {
    title: 'সেটিংস',
    language: 'ভাষা',
    notifications: 'পুশ নোটিফিকেশন',
    notificationsOn: 'চালু -- আপনার কেসের অবস্থা পরিবর্তন হলে আপনাকে জানানো হবে।',
    notificationsOff: 'বন্ধ',
    signOutConfirmTitle: 'সাইন আউট',
    signOutConfirmMessage: 'আপনি কি নিশ্চিত সাইন আউট করতে চান?',
    version: 'ওয়ার্কার্স ওয়েলফেয়ার',
  },
  statuses: {
    new: 'নতুন',
    acknowledged: 'স্বীকৃত',
    inProgress: 'চলমান',
    onHold: 'স্থগিত',
    escalated: 'বৃদ্ধি করা হয়েছে',
    resolved: 'সমাধান হয়েছে',
    partiallyClosed: 'আংশিক বন্ধ',
    closed: 'বন্ধ',
  },
  priorities: {
    low: 'নিম্ন',
    medium: 'মাঝারি',
    high: 'উচ্চ',
    critical: 'অতি জরুরি',
  },
  categories: {
    accommodation: 'বাসস্থান',
    food: 'খাবার',
    salary: 'বেতন',
    overtime: 'ওভারটাইম',
    safety: 'নিরাপত্তা',
    medical: 'চিকিৎসা',
    documentation: 'কাগজপত্র',
    leave: 'ছুটি',
    camp: 'ক্যাম্প',
    finalExit: 'ফাইনাল এক্সিট / টিকিট',
    other: 'অন্যান্য',
  },
};

export const hi: Strings = {
  common: {
    continue: 'जारी रखें',
    cancel: 'रद्द करें',
    save: 'सहेजें',
    retry: 'फिर कोशिश करें',
    loading: 'लोड हो रहा है…',
    signOut: 'साइन आउट',
    back: 'वापस',
    ok: 'ठीक है',
  },
  languageSelect: {
    title: 'अपनी भाषा चुनें',
    subtitle: 'आप इसे बाद में सेटिंग्स में बदल सकते हैं।',
    continueButton: 'जारी रखें',
  },
  login: {
    title: 'वर्कर्स वेलफेयर',
    subtitle: 'डाइनेक्स शिकायत रजिस्ट्री',
    workerId: 'वर्कर आईडी',
    pin: '6 अंकों का PIN',
    signIn: 'साइन इन करें',
    noAccount: 'नए हैं?',
    register: 'खाता बनाएं',
    forgotPin: 'PIN भूल गए? अपने वेलफेयर अधिकारी से रीसेट करवाएं।',
    invalidCredentials: 'वर्कर आईडी या PIN गलत है।',
  },
  register: {
    title: 'अपना खाता बनाएं',
    fullName: 'पूरा नाम',
    workerId: 'वर्कर आईडी',
    project: 'प्रोजेक्ट / साइट',
    phone: 'फोन नंबर',
    phoneOptional: 'फोन नंबर (वैकल्पिक)',
    pin: '6 अंकों का PIN चुनें',
    pinHint: 'केवल अंक, 6 अंक। इसे याद रखें -- हर बार साइन इन के लिए यही उपयोग होगा।',
    confirmPin: 'PIN की पुष्टि करें',
    submit: 'पंजीकरण करें',
    haveAccount: 'पहले से खाता है?',
    signIn: 'साइन इन करें',
    pinMismatch: 'PIN मेल नहीं खाते।',
    pinLength: 'PIN बिल्कुल 6 अंकों का होना चाहिए।',
    workerIdTaken: 'यह वर्कर आईडी पहले से पंजीकृत है। कृपया साइन इन करें।',
    genericError: 'खाता नहीं बनाया जा सका। फिर कोशिश करें।',
  },
  myCases: {
    title: 'मेरे मामले',
    empty: 'आपने अभी तक कुछ भी रिपोर्ट नहीं किया है।',
    reportIssue: 'समस्या रिपोर्ट करें',
    refreshHint: 'रिफ्रेश करने के लिए नीचे खींचें।',
  },
  dashboard: {
    title: 'डैशबोर्ड',
    greeting: 'वापसी पर स्वागत है',
    overview: 'सिंहावलोकन',
    totalCases: 'कुल मामले',
    openCases: 'जारी',
    resolvedCases: 'सुलझाए गए',
    recentCases: 'हाल के मामले',
    viewAll: 'सभी देखें',
    colRef: 'संदर्भ संख्या',
    colCategory: 'श्रेणी',
    colStatus: 'स्थिति',
    colDate: 'तारीख़',
    reportIssue: 'समस्या दर्ज करें',
    emptyState: 'आपने अभी तक कुछ भी रिपोर्ट नहीं किया है।',
    feedbackTitle: 'प्रतिक्रिया',
    feedbackQuestion: 'आपका अनुभव कैसा रहा?',
    feedbackWasClosedOn: 'को बंद किया गया',
    moodVeryHappy: 'बहुत खुश',
    moodHappy: 'खुश',
    moodOk: 'ठीक-ठाक',
    moodSad: 'नाखुश',
  },
  submit: {
    title: 'समस्या रिपोर्ट करें',
    subtitle: 'आप जिस भी भाषा में लिखें, आपके वेलफेयर अधिकारी को यह अंग्रेज़ी में दिखेगा।',
    category: 'किस तरह की समस्या है?',
    description: 'क्या हुआ यह बताएं',
    descriptionPlaceholder: 'अपनी भाषा में लिखें...',
    urgency: 'यह कितना जरूरी है?',
    confidentiality: 'आपका नाम कौन देख सकता है?',
    confidentialityStandard: 'वेलफेयर टीम (सामान्य)',
    confidentialityConfidential: 'गोपनीय रखें',
    confidentialityAnonymous: 'गुमनाम रूप से जमा करें',
    submitButton: 'जमा करें',
    successTitle: 'जमा हो गया',
    successMessage: 'आपका मामला जमा कर दिया गया है।',
    genericError: 'मामला जमा नहीं हो सका। फिर कोशिश करें।',
  },
  caseDetail: {
    status: 'स्थिति',
    category: 'श्रेणी',
    submitted: 'जमा किया गया',
    updates: 'अपडेट',
    noUpdates: 'अभी तक कोई अपडेट नहीं।',
    resolvedQuestion: 'क्या यह हल हो गया?',
    yes: 'हाँ',
    no: 'नहीं',
    satisfaction: 'आप कितने संतुष्ट हैं?',
    comments: 'कोई टिप्पणी? (वैकल्पिक)',
    commentsPlaceholder: 'और बताएं...',
    sendFeedback: 'प्रतिक्रिया भेजें',
    feedbackThanks: 'आपकी प्रतिक्रिया के लिए धन्यवाद।',
    alreadyGaveFeedback: 'आप इस मामले पर पहले ही प्रतिक्रिया दे चुके हैं।',
  },
  evidence: {
    title: 'सबूत',
    subtitle: 'अपने किसी मामले के समर्थन में फ़ोटो जोड़ें।',
    selectCase: 'एक मामला चुनें',
    noCases: 'आपके पास अभी कोई मामला नहीं है। पहले शिकायत दर्ज करें।',
    addPhoto: 'फ़ोटो जोड़ें',
    takePhoto: 'फ़ोटो लें',
    chooseFromLibrary: 'लाइब्रेरी से चुनें',
    uploading: 'अपलोड हो रहा है…',
    uploadError: 'फ़ोटो अपलोड नहीं हो सका। फिर कोशिश करें।',
    noAttachments: 'अभी तक कोई फ़ोटो नहीं जोड़ी गई।',
    submitHint: 'वैकल्पिक — अपने वेलफेयर ऑफिसर को समस्या समझने में मदद के लिए फ़ोटो जोड़ें।',
  },
  settings: {
    title: 'सेटिंग्स',
    language: 'भाषा',
    notifications: 'पुश सूचनाएं',
    notificationsOn: 'चालू -- जब आपके मामले की स्थिति बदलेगी तो आपको सूचित किया जाएगा।',
    notificationsOff: 'बंद',
    signOutConfirmTitle: 'साइन आउट',
    signOutConfirmMessage: 'क्या आप वाकई साइन आउट करना चाहते हैं?',
    version: 'वर्कर्स वेलफेयर',
  },
  statuses: {
    new: 'नया',
    acknowledged: 'स्वीकृत',
    inProgress: 'प्रगति पर',
    onHold: 'रोका गया',
    escalated: 'बढ़ाया गया',
    resolved: 'हल हो गया',
    partiallyClosed: 'आंशिक रूप से बंद',
    closed: 'बंद',
  },
  priorities: {
    low: 'कम',
    medium: 'मध्यम',
    high: 'उच्च',
    critical: 'अति गंभीर',
  },
  categories: {
    accommodation: 'आवास',
    food: 'भोजन',
    salary: 'वेतन',
    overtime: 'ओवरटाइम',
    safety: 'सुरक्षा',
    medical: 'चिकित्सा',
    documentation: 'दस्तावेज़',
    leave: 'छुट्टी',
    camp: 'कैंप',
    finalExit: 'फाइनल एग्जिट / टिकट',
    other: 'अन्य',
  },
};

export const ne: Strings = {
  common: {
    continue: 'जारी राख्नुहोस्',
    cancel: 'रद्द गर्नुहोस्',
    save: 'सुरक्षित गर्नुहोस्',
    retry: 'फेरि प्रयास गर्नुहोस्',
    loading: 'लोड हुँदैछ…',
    signOut: 'साइन आउट',
    back: 'पछाडि',
    ok: 'ठिक छ',
  },
  languageSelect: {
    title: 'आफ्नो भाषा छान्नुहोस्',
    subtitle: 'तपाईं पछि सेटिङमा यो परिवर्तन गर्न सक्नुहुन्छ।',
    continueButton: 'जारी राख्नुहोस्',
  },
  login: {
    title: 'वर्कर्स वेलफेयर',
    subtitle: 'डाइनेक्स गुनासो रजिस्ट्री',
    workerId: 'वर्कर आईडी',
    pin: '६ अंकको PIN',
    signIn: 'साइन इन गर्नुहोस्',
    noAccount: 'नयाँ हुनुहुन्छ?',
    register: 'खाता बनाउनुहोस्',
    forgotPin: 'PIN बिर्सनुभयो? आफ्नो वेलफेयर अधिकारीलाई रिसेट गर्न भन्नुहोस्।',
    invalidCredentials: 'वर्कर आईडी वा PIN गलत छ।',
  },
  register: {
    title: 'आफ्नो खाता बनाउनुहोस्',
    fullName: 'पूरा नाम',
    workerId: 'वर्कर आईडी',
    project: 'प्रोजेक्ट / साइट',
    phone: 'फोन नम्बर',
    phoneOptional: 'फोन नम्बर (वैकल्पिक)',
    pin: '६ अंकको PIN छान्नुहोस्',
    pinHint: 'अंक मात्र, ६ अंक। यो सम्झनुहोस् -- हरेक पटक साइन इन गर्दा यही प्रयोग गर्नुहुनेछ।',
    confirmPin: 'PIN पुष्टि गर्नुहोस्',
    submit: 'दर्ता गर्नुहोस्',
    haveAccount: 'पहिले नै खाता छ?',
    signIn: 'साइन इन गर्नुहोस्',
    pinMismatch: 'PIN मिलेन।',
    pinLength: 'PIN ठ्याक्कै ६ अंकको हुनुपर्छ।',
    workerIdTaken: 'यो वर्कर आईडी पहिले नै दर्ता भइसकेको छ। कृपया साइन इन गर्नुहोस्।',
    genericError: 'खाता बनाउन सकिएन। फेरि प्रयास गर्नुहोस्।',
  },
  myCases: {
    title: 'मेरा केसहरू',
    empty: 'तपाईंले अहिलेसम्म केही रिपोर्ट गर्नुभएको छैन।',
    reportIssue: 'समस्या रिपोर्ट गर्नुहोस्',
    refreshHint: 'रिफ्रेश गर्न तल तान्नुहोस्।',
  },
  dashboard: {
    title: 'ड्यासबोर्ड',
    greeting: 'फेरि स्वागत छ',
    overview: 'सिंहावलोकन',
    totalCases: 'जम्मा मामिलाहरू',
    openCases: 'जारी',
    resolvedCases: 'समाधान भयो',
    recentCases: 'भर्खरका मामिलाहरू',
    viewAll: 'सबै हेर्नुहोस्',
    colRef: 'सन्दर्भ नम्बर',
    colCategory: 'श्रेणी',
    colStatus: 'स्थिति',
    colDate: 'मिति',
    reportIssue: 'समस्या रिपोर्ट गर्नुहोस्',
    emptyState: 'तपाईंले अहिलेसम्म केही रिपोर्ट गर्नुभएको छैन।',
    feedbackTitle: 'प्रतिक्रिया',
    feedbackQuestion: 'तपाईंको अनुभव कस्तो थियो?',
    feedbackWasClosedOn: 'बन्द गरियो',
    moodVeryHappy: 'धेरै खुसी',
    moodHappy: 'खुसी',
    moodOk: 'ठिकै',
    moodSad: 'असन्तुष्ट',
  },
  submit: {
    title: 'समस्या रिपोर्ट गर्नुहोस्',
    subtitle: 'तपाईंले जुनसुकै भाषामा लेख्नुभए पनि, तपाईंको वेलफेयर अधिकारीले यो अंग्रेजीमा देख्नुहुनेछ।',
    category: 'कस्तो प्रकारको समस्या हो?',
    description: 'के भयो वर्णन गर्नुहोस्',
    descriptionPlaceholder: 'आफ्नै भाषामा लेख्नुहोस्...',
    urgency: 'यो कति जरुरी छ?',
    confidentiality: 'तपाईंको नाम कसले देख्न सक्छ?',
    confidentialityStandard: 'वेलफेयर टिम (सामान्य)',
    confidentialityConfidential: 'गोप्य राख्नुहोस्',
    confidentialityAnonymous: 'बेनामी पेश गर्नुहोस्',
    submitButton: 'पेश गर्नुहोस्',
    successTitle: 'पेश भयो',
    successMessage: 'तपाईंको केस पेश गरिएको छ।',
    genericError: 'तपाईंको केस पेश गर्न सकिएन। फेरि प्रयास गर्नुहोस्।',
  },
  caseDetail: {
    status: 'स्थिति',
    category: 'श्रेणी',
    submitted: 'पेश गरिएको',
    updates: 'अपडेटहरू',
    noUpdates: 'अहिलेसम्म कुनै अपडेट छैन।',
    resolvedQuestion: 'के यो समाधान भयो?',
    yes: 'हो',
    no: 'होइन',
    satisfaction: 'तपाईं कति सन्तुष्ट हुनुहुन्छ?',
    comments: 'कुनै टिप्पणी? (वैकल्पिक)',
    commentsPlaceholder: 'थप बताउनुहोस्...',
    sendFeedback: 'प्रतिक्रिया पठाउनुहोस्',
    feedbackThanks: 'तपाईंको प्रतिक्रियाको लागि धन्यवाद।',
    alreadyGaveFeedback: 'तपाईंले यो केसमा पहिले नै प्रतिक्रिया दिनुभएको छ।',
  },
  evidence: {
    title: 'प्रमाण',
    subtitle: 'आफ्नो कुनै केसको समर्थनमा फोटोहरू संलग्न गर्नुहोस्।',
    selectCase: 'केस छान्नुहोस्',
    noCases: 'तपाईंसँग अहिलेसम्म कुनै केस छैन। पहिले गुनासो पेश गर्नुहोस्।',
    addPhoto: 'फोटो थप्नुहोस्',
    takePhoto: 'फोटो खिच्नुहोस्',
    chooseFromLibrary: 'लाइब्रेरीबाट छान्नुहोस्',
    uploading: 'अपलोड हुँदैछ…',
    uploadError: 'फोटो अपलोड हुन सकेन। फेरि प्रयास गर्नुहोस्।',
    noAttachments: 'अहिलेसम्म कुनै फोटो थपिएको छैन।',
    submitHint: 'वैकल्पिक — तपाईंको वेलफेयर अफिसरलाई समस्या बुझ्न मद्दत गर्न फोटोहरू थप्नुहोस्।',
  },
  settings: {
    title: 'सेटिङहरू',
    language: 'भाषा',
    notifications: 'पुश सूचनाहरू',
    notificationsOn: 'खुला -- तपाईंको केसको स्थिति परिवर्तन हुँदा तपाईंलाई सूचित गरिनेछ।',
    notificationsOff: 'बन्द',
    signOutConfirmTitle: 'साइन आउट',
    signOutConfirmMessage: 'के तपाईं साँच्चै साइन आउट गर्न चाहनुहुन्छ?',
    version: 'वर्कर्स वेलफेयर',
  },
  statuses: {
    new: 'नयाँ',
    acknowledged: 'स्वीकृत',
    inProgress: 'प्रगतिमा',
    onHold: 'रोकिएको',
    escalated: 'बढाइएको',
    resolved: 'समाधान भयो',
    partiallyClosed: 'आंशिक रूपमा बन्द',
    closed: 'बन्द',
  },
  priorities: {
    low: 'कम',
    medium: 'मध्यम',
    high: 'उच्च',
    critical: 'अति गम्भीर',
  },
  categories: {
    accommodation: 'आवास',
    food: 'खाना',
    salary: 'तलब',
    overtime: 'ओभरटाइम',
    safety: 'सुरक्षा',
    medical: 'स्वास्थ्य',
    documentation: 'कागजात',
    leave: 'बिदा',
    camp: 'क्याम्प',
    finalExit: 'फाइनल एग्जिट / टिकट',
    other: 'अन्य',
  },
};

export const tl: Strings = {
  common: {
    continue: 'Magpatuloy',
    cancel: 'Kanselahin',
    save: 'I-save',
    retry: 'Subukan muli',
    loading: 'Naglo-load…',
    signOut: 'Mag-sign out',
    back: 'Bumalik',
    ok: 'OK',
  },
  languageSelect: {
    title: 'Piliin ang iyong wika',
    subtitle: 'Puwede mo itong baguhin sa Settings mamaya.',
    continueButton: 'Magpatuloy',
  },
  login: {
    title: 'Workers Welfare',
    subtitle: 'DYNEX Grievance Registry',
    workerId: 'Worker ID',
    pin: '6-digit na PIN',
    signIn: 'Mag-sign in',
    noAccount: 'Bago lang dito?',
    register: 'Gumawa ng account',
    forgotPin: 'Nakalimutan ang PIN? Pakiusapan ang inyong Welfare Officer na i-reset ito.',
    invalidCredentials: 'Mali ang Worker ID o PIN.',
  },
  register: {
    title: 'Gumawa ng iyong account',
    fullName: 'Buong pangalan',
    workerId: 'Worker ID',
    project: 'Proyekto / site',
    phone: 'Numero ng telepono',
    phoneOptional: 'Numero ng telepono (opsyonal)',
    pin: 'Pumili ng 6-digit na PIN',
    pinHint: 'Numero lang, 6 na digit. Tandaan ito -- gagamitin mo ito tuwing mag-sign in.',
    confirmPin: 'Kumpirmahin ang PIN',
    submit: 'Magparehistro',
    haveAccount: 'May account ka na?',
    signIn: 'Mag-sign in',
    pinMismatch: 'Hindi magkatugma ang PIN.',
    pinLength: 'Dapat eksaktong 6 na digit ang PIN.',
    workerIdTaken: 'Rehistrado na ang Worker ID na ito. Subukan na lang mag-sign in.',
    genericError: 'Hindi magawa ang account. Subukan muli.',
  },
  myCases: {
    title: 'Aking mga Kaso',
    empty: 'Wala ka pang na-report.',
    reportIssue: 'Mag-report ng isyu',
    refreshHint: 'Hilahin pababa para i-refresh.',
  },
  dashboard: {
    title: 'Dashboard',
    greeting: 'Maligayang pagbabalik',
    overview: 'Pangkalahatang-ideya',
    totalCases: 'Kabuuang mga kaso',
    openCases: 'Kasalukuyan',
    resolvedCases: 'Naresolba',
    recentCases: 'Kamakailang mga kaso',
    viewAll: 'Tingnan lahat',
    colRef: 'Reference',
    colCategory: 'Kategorya',
    colStatus: 'Katayuan',
    colDate: 'Petsa',
    reportIssue: 'Mag-ulat ng isyu',
    emptyState: 'Wala ka pang naiuulat.',
    feedbackTitle: 'Puna',
    feedbackQuestion: 'Kumusta ang iyong karanasan?',
    feedbackWasClosedOn: 'isinara noong',
    moodVeryHappy: 'Sobrang Saya',
    moodHappy: 'Masaya',
    moodOk: 'Okay Lang',
    moodSad: 'Malungkot',
  },
  submit: {
    title: 'Mag-report ng isyu',
    subtitle: 'Anumang wika ang gamitin mo, makikita ito ng inyong Welfare Officer sa Ingles.',
    category: 'Anong uri ng isyu?',
    description: 'Ilarawan ang nangyari',
    descriptionPlaceholder: 'Isulat sa sarili mong wika...',
    urgency: 'Gaano ito kaurgente?',
    confidentiality: 'Sino ang makakakita ng iyong pangalan?',
    confidentialityStandard: 'Welfare team (normal)',
    confidentialityConfidential: 'Panatilihing kumpidensyal',
    confidentialityAnonymous: 'Isumite nang anonymous',
    submitButton: 'Isumite',
    successTitle: 'Naisumite na',
    successMessage: 'Naisumite na ang iyong kaso.',
    genericError: 'Hindi maisumite ang iyong kaso. Subukan muli.',
  },
  caseDetail: {
    status: 'Katayuan',
    category: 'Kategorya',
    submitted: 'Isinumite',
    updates: 'Mga Update',
    noUpdates: 'Wala pang update.',
    resolvedQuestion: 'Naresolba ba ito?',
    yes: 'Oo',
    no: 'Hindi',
    satisfaction: 'Gaano ka nasisiyahan?',
    comments: 'May komento? (opsyonal)',
    commentsPlaceholder: 'Sabihin pa...',
    sendFeedback: 'Magpadala ng feedback',
    feedbackThanks: 'Salamat sa iyong feedback.',
    alreadyGaveFeedback: 'Nagbigay ka na ng feedback sa kasong ito.',
  },
  evidence: {
    title: 'Ebidensya',
    subtitle: 'Maglakip ng mga larawan para suportahan ang isa sa iyong mga kaso.',
    selectCase: 'Pumili ng kaso',
    noCases: 'Wala ka pang kaso. Magsumite muna ng reklamo.',
    addPhoto: 'Magdagdag ng larawan',
    takePhoto: 'Kumuha ng larawan',
    chooseFromLibrary: 'Pumili mula sa library',
    uploading: 'Ina-upload…',
    uploadError: 'Hindi ma-upload ang larawan. Subukan muli.',
    noAttachments: 'Wala pang idinagdag na larawan.',
    submitHint: 'Opsyonal — magdagdag ng mga larawan para matulungan ang iyong Welfare Officer na maintindihan ang isyu.',
  },
  settings: {
    title: 'Mga Setting',
    language: 'Wika',
    notifications: 'Push notifications',
    notificationsOn: 'Naka-on -- maaabisuhan ka kapag nagbago ang katayuan ng iyong kaso.',
    notificationsOff: 'Naka-off',
    signOutConfirmTitle: 'Mag-sign out',
    signOutConfirmMessage: 'Sigurado ka bang gusto mong mag-sign out?',
    version: 'Workers Welfare',
  },
  statuses: {
    new: 'Bago',
    acknowledged: 'Kinilala',
    inProgress: 'Isinasagawa',
    onHold: 'Naka-hold',
    escalated: 'Na-escalate',
    resolved: 'Naresolba',
    partiallyClosed: 'Bahagyang Sarado',
    closed: 'Sarado',
  },
  priorities: {
    low: 'Mababa',
    medium: 'Katamtaman',
    high: 'Mataas',
    critical: 'Kritikal',
  },
  categories: {
    accommodation: 'Tirahan',
    food: 'Pagkain',
    salary: 'Sahod',
    overtime: 'Overtime',
    safety: 'Kaligtasan',
    medical: 'Medikal',
    documentation: 'Dokumentasyon',
    leave: 'Bakasyon',
    camp: 'Kampo',
    finalExit: 'Final Exit / Tiket',
    other: 'Iba pa',
  },
};

export const zh: Strings = {
  common: {
    continue: '继续',
    cancel: '取消',
    save: '保存',
    retry: '重试',
    loading: '加载中…',
    signOut: '退出登录',
    back: '返回',
    ok: '确定',
  },
  languageSelect: {
    title: '选择您的语言',
    subtitle: '您稍后可以在设置中更改。',
    continueButton: '继续',
  },
  login: {
    title: '工人福利',
    subtitle: 'DYNEX 申诉登记系统',
    workerId: '工号',
    pin: '6位数密码',
    signIn: '登录',
    noAccount: '第一次使用？',
    register: '创建账户',
    forgotPin: '忘记密码？请联系您的福利官员重置。',
    invalidCredentials: '工号或密码不正确。',
  },
  register: {
    title: '创建您的账户',
    fullName: '姓名',
    workerId: '工号',
    project: '项目 / 工地',
    phone: '电话号码',
    phoneOptional: '电话号码（可选）',
    pin: '设置6位数密码',
    pinHint: '仅限数字，6位。请记住此密码——每次登录都需要用到。',
    confirmPin: '确认密码',
    submit: '注册',
    haveAccount: '已经有账户？',
    signIn: '登录',
    pinMismatch: '两次输入的密码不一致。',
    pinLength: '密码必须正好是6位数字。',
    workerIdTaken: '该工号已被注册，请直接登录。',
    genericError: '无法创建账户，请重试。',
  },
  myCases: {
    title: '我的案例',
    empty: '您还没有提交过任何申诉。',
    reportIssue: '提交问题',
    refreshHint: '下拉刷新。',
  },
  dashboard: {
    title: '仪表板',
    greeting: '欢迎回来',
    overview: '概览',
    totalCases: '总案件数',
    openCases: '处理中',
    resolvedCases: '已解决',
    recentCases: '最近案件',
    viewAll: '查看全部',
    colRef: '编号',
    colCategory: '类别',
    colStatus: '状态',
    colDate: '日期',
    reportIssue: '报告问题',
    emptyState: '您还没有提交任何报告。',
    feedbackTitle: '反馈',
    feedbackQuestion: '您的体验如何?',
    feedbackWasClosedOn: '关闭于',
    moodVeryHappy: '非常满意',
    moodHappy: '满意',
    moodOk: '一般',
    moodSad: '不满意',
  },
  submit: {
    title: '提交问题',
    subtitle: '无论您使用哪种语言书写，您的福利官员都会看到英文版本。',
    category: '这是什么类型的问题？',
    description: '请描述发生的事情',
    descriptionPlaceholder: '请用您自己的语言书写…',
    urgency: '这有多紧急？',
    confidentiality: '谁可以看到您的姓名？',
    confidentialityStandard: '福利团队（正常）',
    confidentialityConfidential: '保密',
    confidentialityAnonymous: '匿名提交',
    submitButton: '提交',
    successTitle: '已提交',
    successMessage: '您的案例已提交。',
    genericError: '无法提交您的案例，请重试。',
  },
  caseDetail: {
    status: '状态',
    category: '类别',
    submitted: '提交时间',
    updates: '更新记录',
    noUpdates: '暂无更新。',
    resolvedQuestion: '问题解决了吗？',
    yes: '是',
    no: '否',
    satisfaction: '您的满意度如何？',
    comments: '有什么意见吗？（可选）',
    commentsPlaceholder: '请详细说明…',
    sendFeedback: '发送反馈',
    feedbackThanks: '感谢您的反馈。',
    alreadyGaveFeedback: '您已经对此案例提交过反馈。',
  },
  evidence: {
    title: '证据',
    subtitle: '上传照片以支持您的某个案例。',
    selectCase: '选择一个案例',
    noCases: '您还没有任何案例。请先提交申诉。',
    addPhoto: '添加照片',
    takePhoto: '拍照',
    chooseFromLibrary: '从相册选择',
    uploading: '上传中…',
    uploadError: '照片上传失败，请重试。',
    noAttachments: '尚未添加任何照片。',
    submitHint: '可选 — 添加照片以帮助您的福利官员了解问题。',
  },
  settings: {
    title: '设置',
    language: '语言',
    notifications: '推送通知',
    notificationsOn: '已开启——案例状态变化时会通知您。',
    notificationsOff: '已关闭',
    signOutConfirmTitle: '退出登录',
    signOutConfirmMessage: '确定要退出登录吗？',
    version: '工人福利',
  },
  statuses: {
    new: '新建',
    acknowledged: '已确认',
    inProgress: '处理中',
    onHold: '暂缓',
    escalated: '已升级',
    resolved: '已解决',
    partiallyClosed: '部分结案',
    closed: '已结案',
  },
  priorities: {
    low: '低',
    medium: '中',
    high: '高',
    critical: '紧急',
  },
  categories: {
    accommodation: '住宿',
    food: '餐饮',
    salary: '薪资',
    overtime: '加班',
    safety: '安全',
    medical: '医疗',
    documentation: '证件',
    leave: '休假',
    camp: '营地',
    finalExit: '离境 / 机票',
    other: '其他',
  },
};

export const STRINGS: Record<string, Strings> = { en, ur, ar, bn, hi, ne, tl, zh };
