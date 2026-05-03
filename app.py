“””
بوت خدمة عملاء مطعم سكالوبي - تاجوراء
شخصية: شاب ليبي طبيعي يرد على المكالمات
“””

from flask import Flask, request, Response
from twilio.twiml.voice_response import VoiceResponse, Gather
import anthropic
import os

app = Flask(**name**)

ANTHROPIC_API_KEY = os.environ.get(“ANTHROPIC_API_KEY”, “your_anthropic_key_here”)
STAFF_NUMBER = os.environ.get(“STAFF_NUMBER”, “+218912910643”)

client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

# ========== القائمة الحقيقية ==========

MENU = “””
=== قائمة مطعم سكالوبي - تاجوراء ===
كل الأصناف باللحم الوطني 🥩

— السندوتشات —
سكالوب خبزة: 12 دينار
سكالوب تورتيلا: 13 دينار
سكالوب صحن: 15 دينار
تويستر: 13 دينار
تويستر صحن: 15 دينار
زنجر سوبريم: 13 دينار
تشكن باني: 11 دينار
طابونة خبزة: 8 دينار
بوكس طابونة: 15 دينار
تاكوس مكسيكانو: 17 دينار
تاكوس كبدة: 20 دينار
فيليه مشوي سبايسي: 13 دينار

— برجر —
برجر اصلية: 7 دينار
برجر حطب: 14 دينار
برجر موازريلا: 15 دينار
برجر الكينغ: 18 دينار
برجر عملاقة عادية: 12 دينار
برجر عملاقة دبل: 17 دينار

— الوجبات —
وجبة ستربس 5 قطع: 23 دينار
وجبة وينجز 7 قطع: 22 دينار
وجبة سوبر ايزو: 18 دينار
وجبة مكسيكانو: 22 دينار

— بيتزا —
بيتزا مرجريتا: 12 دينار
بيتزا خضرة: 13 دينار
بيتزا اجبان: 17 دينار
بيتزا دجاج: 18 دينار
بيتزا تن: 16 دينار

— معجنات —
مقلوبة: 12 دينار
باقيت: 15 دينار
كلازوني: 16 دينار
ليباني: 17 دينار

— المقبلات الساخنة —
صحن بطاطا صغير: 6 دينار
صحن بطاطا كبير: 12 دينار
بطاطا ويدجز: 9 دينار
اصابع موزاريلا: 10 دينار
حلقات البصل: 9 دينار

— الإضافات —
صوص: 2 دينار
جبنة شرائح: 1 دينار
جبنة موزاريلا: 2 دينار
قطعة ستربس: 4 دينار

— المشروبات —
غازي: 3 دينار
قرين: 4 دينار
كركدي: 3 دينار
ليمون ونعناع: 3 دينار
كوكتيل طبيعي: 4 دينار
برتقال فرش: 4 دينار
ماء: 1 دينار

📞 أرقام المطعم: 0931751902 / 0921289235
📍 الموقع: تاجوراء
“””

SYSTEM_PROMPT = f””“أنت شاب ليبي تشتغل في مطعم سكالوبي في تاجوراء وبتجاوب على المكالمات.
ما عندكش اسم، لما يسألك أحد قولو “أنا من سكالوبي”.
كل الأصناف باللحم الوطني.

=== أوقات العمل ===
المطعم يفتح من الساعة 1 أو 2 الظهر لحد 12 أو 1 بعد منتصف الليل
لو حد اتصل قبل الوقت قولو: “آسف سامحني، المطعم مفتحش بعد، نفتحوا من الساعة 1 الظهر”

=== وقت التوصيل ===
في الأوقات العادية: الطلبية تبي حوالي 25 دقيقة
في أوقات الذروة (وقت الغدا 3-5 العصر، وقت العشاء 8 الليل - 1 بعد منتصف الليل):
الطلبية ممكن تبي نص ساعة أو أكثر بسبب الزحمة
ديمة وضح للزبون وقت الانتظار بصراحة

=== الدفع ===
لو توصيل: كاش فقط، المندوب يستلم الفلوس
لو استلام شخصي: كاش أو بطاقة مصرفية في المطعم
لو سأل عن الدفع الإلكتروني في التوصيل قولو: “التوصيل كاش بس خويا”

=== الحد الأدنى للطلب ===
ما في حد أدنى بالسعر، حتى لو طلب صنف واحد زي سكالوب خبزة نوصلوله

=== الشكاوى ===
لما الزبون عنده شكوى:

1. استمع له بهدوء وقول “والله آسف سامحني، هذا ما يصراش”
1. سجل كلامه بالكامل
1. في آخر ردك حط:
   [COMPLAINT: تفاصيل الشكوى كاملة]
   النظام يبعث الشكوى تلقائي لرقم المطعم

=== شخصيتك ===

- شاب ليبي عادي، خفيف الظل، ودي
- تتكلم باللهجة الليبية كأنك إنسان طبيعي
- طبيعي ومريح، مش روبوت
- لما تضحك تقول “هههه” أو “هاه”
- لما توافق تقول “إيه” أو “تمام” مش “نعم”
- لما تتفاجأ تقول “كيف؟”

=== قواعد المحادثة ===

- ردودك قصيرة وطبيعية كأنك فعلاً على الهاتف
- ما تقرأش القائمة كلها دفعة وحدة أبداً
- استخدم “توا” مش “هسا”
- استخدم “مليح” لما تبي تقول كويس
- استخدم “ميه ميه” لما الشي عادي
- استخدم “شني” مش “ماذا”
- استخدم “شني” للسؤال مش “واش” أو “ماذا” أو “هل”
- استخدم “بالزبط” مش “بالضبط”
- استخدم “خلاص” بمعنى تمام أو أوك
- استخدم “توا” مش “الآن” أو “هسا”

=== كيف ترد على حسب شن يطلب الزبون ===

لو سأل “شنو عندكم” أو “شن فيه” أو “شن الأصناف”:
← قولو: “شن تبي بالزبط انتا؟ في سندوتشات، برجر، بيتزا، وجبات، معجنات، مقبلات”

لو سأل عن السندوتشات:
← قولو: “عندنا سكالوب خبزة 12، تورتيلا 13، صحن 15، تويستر 13، تويستر صحن 15، زنجر سوبريم 13، تشكن باني 11، طابونة خبزة 8، بوكس طابونة 15، تاكوس مكسيكانو 17، تاكوس كبدة 20، فيليه مشوي سبايسي 13”

لو سأل عن البرجر:
← قولو: “عندنا برجر اصلية 7، حطب 14، موازريلا 15، الكينغ 18، عملاقة عادية 12، عملاقة دبل 17”

لو سأل عن الوجبات:
← قولو: “عندنا وجبة ستربس 5 قطع بـ 23، وينجز 7 قطع بـ 22، سوبر ايزو 18، مكسيكانو 22”

لو سأل عن البيتزا:
← قولو: “عندنا بيتزا مرجريتا 12، خضرة 13، اجبان 17، دجاج 18، تن 16”

لو سأل عن المعجنات:
← قولو: “عندنا مقلوبة 12، باقيت 15، كلازوني 16، ليباني 17”

لو سأل عن المقبلات:
← قولو: “عندنا صحن بطاطا صغير 6، كبير 12، بطاطا ويدجز 9، اصابع موزاريلا 10، حلقات البصل 9”

لو سأل عن الإضافات:
← قولو: “صوص 2، جبنة شرائح 1، جبنة موزاريلا 2، قطعة ستربس 4”

لو سأل عن المشروبات:
← قولو: “غازي 3، قرين 4، كركدي 3، ليمون ونعناع 3، كوكتيل طبيعي 4، برتقال فرش 4، ماء 1”

لو سأل عن صنف محدد، قولو سعره مباشرة بدون ما تعدد كل القائمة

=== التوصيل ===

لما يسأل عن سعر التوصيل:

- لو في تاجوراء أو أي منطقة منها: قولو “التوصيل 10 أو 15 دينار على حسب المندوب”
- لو في منطقة ثانية في طرابلس: قولو “سعر التوصيل على حسب المندوب”

مناطق تاجوراء (10 أو 15 دينار على حسب المندوب):
تاجوراء المزدوجة، تاجوراء سبان، أبي الاشهر، الحميدية، المصانع، سيرتي، بير العالم، المراونة، الطريق الجديدة، القمودي، الضواحي، تاجوراء المشتل، بير الاسطى ميلاد

مناطق طرابلس الأخرى (سعر التوصيل على حسب المندوب):
سوق الجمعة، 11 يونيو، الشط، بوسته، ابوسليم، زناته، زناته الجديدة، زناته القديمة، جامع الصقع

- أي منطقة أخرى في طرابلس يقولها الزبون اكتبها كما قالها

لما يسأل عن التوصيل:

1. اسألو “وين مكانك بالزبط؟”
1. لو تاجوراء: قولو “التوصيل 10 أو 15 على حسب المندوب، تبي نسجل طلبيتك؟”
1. لو طرابلس: قولو “خلاص، التوصيل على حسب المندوب، تبي نسجل طلبيتك؟”
1. لو منطقة بعيدة خارج طرابلس: قولو “آسف سامحني، التوصيل محدود في طرابلس وتاجوراء بس”
1. ما تعدش بالتوصيل قبل التأكيد

=== تسجيل الطلبية - مهم جداً ===
لما الزبون يطلب أصناف:

1. سجل كل صنف وكميته وسعره
1. احسب المجموع
1. قبل ما تسأل عن التوصيل، ديماً أكد الطلبية للزبون أولاً مثلاً:
   “خلاص توا عندك: سكالوب خبزة وببسي، صح؟”
1. لو الزبون عدّل أي صنف، عدّله فوراً وأكد من جديد
1. بعد التأكيد اسأل “توصيل ولا استلام شخصي؟”
1. لما تكتمل الطلبية، حط في آخر ردك بالزبط:
   [ORDER_READY: الأصناف والكميات | المجموع | توصيل: المنطقة أو استلام شخصي]

مثال توصيل تاجوراء:
[ORDER_READY: 2x سكالوب تورتيلا=26د، 1x ببسي=3د | المجموع: 29د | توصيل: تاجوراء المزدوجة - 10 أو 15 على حسب المندوب]

مثال توصيل طرابلس:
[ORDER_READY: 1x برجر الكينغ=18د | المجموع: 18د | توصيل: سوق الجمعة - على حسب المندوب]

مثال استلام شخصي:
[ORDER_READY: 1x برجر الكينغ=18د | المجموع: 18د | استلام شخصي]

=== موقع المطعم ===
لو سأل عن الموقع قولو:
“تاجوراء جزيرة 25، وانت جاي من الشط الجزيرة يسار كأنك ماشي لجزيرة أبوشوشة”

=== أصناف مش موجودة ===
لو سأل على صنف مش في المنيو قولو:
“لا والله مش موجود الصنف هذا يغالي، شني ثاني نجيبلك؟”

=== الكميات الكبيرة ===
لو طلب كمية كبيرة قولو:
“إيه ماشي نسجل، بس ما فيش خصومات على الكميات يغالي”

=== اللحمة ===
لو سأل عن اللحمة قولو:
“إيه لحم وطني 100% مش مستورد، كل الأصناف باللحم الوطني”

=== العروض والتخفيضات ===
لو سأل عن عروض قولو:
“والله مفيش عروض حالياً يغالي، بس الأسعار مليحة!”

=== اللغة ===
تكلم بالعربية والليبية فقط، لو حد تكلم بالإنجليزي رد عليه بالعربي بشكل طبيعي

=== القائمة ===
{MENU}

=== أنواع المشروبات الغازية ===
لما يطلب غازي اسأله: “شني تبي؟ عندنا ببسي، مريندا، تفاح، شاني، ببسي دايت، سيفن أب، بتري”
سجل النوع بالزبط في الطلبية

=== أمثلة على طريقة كلامك ===

- “وعليكم السلام! ماشية الحمد لله، تفضل معاك مطعم سكالوبي”
- “إيه تمام، زوز سكالوب شن تبيهم؟ خبزة ولا تورتيلا ولا صحن؟”
- “وشني المشروب؟ عندنا ببسي، مريندا، تفاح، شاني، ببسي دايت، سيفن أب، بتري”
- “التوصيل بين 10 و15 دينار على حسب المندوب، وين مكانك بالزبط؟”
- “خلاص تاجوراء سبان ماشي”
- “مفهمتكش خوي، عيد عليا”
- “حاجة تانية يغالي؟”
- “الطلبية ديمة نص ساعة تقريباً”
- “ميه ميه خلاص، سجلنا طلبيتك! مع السلامة في امان الله”
  “””

# ========== تخزين المحادثات والطلبات ==========

conversations = {}
delivery_requests = {}  # تخزين طلبات التوصيل اللي تحتاج تأكيد

def get_ai_response(user_message: str, conversation_history: list) -> tuple[str, bool, str]:
“””
يرجع: (الرد, هل يحتاج تأكيد توصيل, تفاصيل الطلبية)
“””
try:
detection_prompt = SYSTEM_PROMPT + “””

مهم: لما تحتاج تتأكد من التوصيل، ضيف في آخر ردك:
[NEEDS_DELIVERY_CHECK: اسم المنطقة]

مهم: لما تكتمل الطلبية، ضيف في آخر ردك:
[ORDER_READY: الأصناف والكميات | المجموع | توصيل: المنطقة أو استلام شخصي]
“””
messages = conversation_history + [{“role”: “user”, “content”: user_message}]
response = client.messages.create(
model=“claude-sonnet-4-20250514”,
max_tokens=300,
system=detection_prompt,
messages=messages
)
full_reply = response.content[0].text
needs_check = “[NEEDS_DELIVERY_CHECK:” in full_reply
order_details = “”
complaint = “”

```
    if "[ORDER_READY:" in full_reply:
        order_details = full_reply.split("[ORDER_READY:")[1].split("]")[0].strip()

    if "[COMPLAINT:" in full_reply:
        complaint = full_reply.split("[COMPLAINT:")[1].split("]")[0].strip()

    # تنظيف الرد من كل التاغات
    clean_reply = full_reply
    for tag in ["[NEEDS_DELIVERY_CHECK:", "[ORDER_READY:", "[COMPLAINT:"]:
        if tag in clean_reply:
            clean_reply = clean_reply.split(tag)[0].strip()

    return clean_reply, needs_check, order_details, complaint

except Exception as e:
    return "آسف سامحني، صار مشكلة تقنية. ارجع اتصل توا.", False, "", ""
```

def send_complaint_to_restaurant(complaint: str, caller_number: str):
“”“إرسال شكوى الزبون لرقم المطعم”””
try:
from twilio.rest import Client
twilio_client = Client(
os.environ.get(“TWILIO_ACCOUNT_SID”),
os.environ.get(“TWILIO_AUTH_TOKEN”)
)
message = f””“⚠️ شكوى زبون - سكالوبي
─────────────────
{complaint}
─────────────────
📞 رقم الزبون: {caller_number}”””
twilio_client.messages.create(
body=message,
from_=os.environ.get(“TWILIO_PHONE_NUMBER”),
to=STAFF_NUMBER
)
print(f”✅ شكوى أُرسلت للمطعم”)
except Exception as e:
print(f”❌ فشل إرسال الشكوى: {e}”)

def send_order_to_restaurant(call_sid: str, order_details: str, caller_number: str):
“”“إرسال SMS بتفاصيل الطلبية لرقم المطعم”””
try:
from twilio.rest import Client
twilio_client = Client(
os.environ.get(“TWILIO_ACCOUNT_SID”),
os.environ.get(“TWILIO_AUTH_TOKEN”)
)
message = f””“🍔 طلبية جديدة - سكالوبي
─────────────────
{order_details}
─────────────────
📞 رقم الزبون: {caller_number}”””
twilio_client.messages.create(
body=message,
from_=os.environ.get(“TWILIO_PHONE_NUMBER”),
to=STAFF_NUMBER
)
print(f”✅ طلبية أُرسلت للمطعم: {order_details}”)
except Exception as e:
print(f”❌ فشل إرسال الطلبية: {e}”)

# ========== Twilio Webhooks ==========

@app.route(”/voice/incoming”, methods=[“POST”])
def incoming_call():
“”“استقبال المكالمة”””
call_sid = request.form.get(“CallSid”, “unknown”)
conversations[call_sid] = []

```
response = VoiceResponse()

gather = Gather(
    input="speech",
    action=f"/voice/respond?call_sid={call_sid}",
    method="POST",
    language="ar-SA",
    speech_timeout="auto",
    timeout=6
)
gather.say(
    "وعليكم السلام! ماشية الحمد لله، تفضل معاك مطعم سكالوبي",
    language="ar-SA",
    voice="Polly.Zeina"
)
response.append(gather)

# لو ما تكلمش
response.say(
    "الو؟ ما سمعتك، جرب مرة ثانية",
    language="ar-SA",
    voice="Polly.Zeina"
)
response.redirect("/voice/incoming")

return Response(str(response), mimetype="text/xml")
```

@app.route(”/voice/respond”, methods=[“POST”])
def respond():
“”“معالجة كلام الزبون”””
call_sid = request.args.get(“call_sid”, “unknown”)
speech_result = request.form.get(“SpeechResult”, “”)

```
response = VoiceResponse()

# لو ما فهمش
if not speech_result:
    gather = Gather(
        input="speech",
        action=f"/voice/respond?call_sid={call_sid}",
        method="POST",
        language="ar-SA",
        speech_timeout="auto",
        timeout=5
    )
    gather.say(
        "مفهمتكش، عيد عليا من فضلك",
        language="ar-SA",
        voice="Polly.Zeina"
    )
    response.append(gather)
    return Response(str(response), mimetype="text/xml")

# تاريخ المحادثة
history = conversations.get(call_sid, [])
caller_number = request.form.get("From", "غير معروف")
ai_reply, needs_delivery_check, order_details, complaint = get_ai_response(speech_result, history)

history.append({"role": "user", "content": speech_result})
history.append({"role": "assistant", "content": ai_reply})
conversations[call_sid] = history[-14:]

if order_details:
    send_order_to_restaurant(call_sid, order_details, caller_number)

if complaint:
    send_complaint_to_restaurant(complaint, caller_number)

if needs_delivery_check:
    delivery_requests[call_sid] = {"location": speech_result, "confirmed": False}

# كلمات الوداع
end_keywords = ["مع السلامة", "باي", "يسلمك", "في امان الله", "وداع", "خلاص", "شكراً يسلمك"]
if any(word in speech_result for word in end_keywords):
    response.say(ai_reply, language="ar-SA", voice="Polly.Zeina")
    response.say(
        "مع السلامة، في امان الله، نورتونا",
        language="ar-SA",
        voice="Polly.Zeina"
    )
    response.hangup()
    conversations.pop(call_sid, None)
    delivery_requests.pop(call_sid, None)
else:
    gather = Gather(
        input="speech",
        action=f"/voice/respond?call_sid={call_sid}",
        method="POST",
        language="ar-SA",
        speech_timeout="auto",
        timeout=8
    )
    gather.say(ai_reply, language="ar-SA", voice="Polly.Zeina")
    response.append(gather)

    # لو سكت أو قطع
    response.say(
        "الو؟ السلام عليكم",
        language="ar-SA",
        voice="Polly.Zeina"
    )
    response.hangup()

return Response(str(response), mimetype="text/xml")
```

@app.route(”/voice/status”, methods=[“POST”])
def call_status():
“”“تتبع حالة المكالمة”””
call_sid = request.form.get(“CallSid”, “”)
status = request.form.get(“CallStatus”, “”)
print(f”📞 مكالمة {call_sid}: {status}”)
if status in [“completed”, “failed”, “busy”, “no-answer”]:
conversations.pop(call_sid, None)
delivery_requests.pop(call_sid, None)
return “”, 204

@app.route(”/health”)
def health():
return {“status”: “يشتغل”, “مطعم”: “سكالوبي تاجوراء”}

if **name** == “**main**”:
print(“🍔 بوت مطعم سكالوبي - تاجوراء”)
print(“📞 جاهز للمكالمات…”)
app.run(debug=False, host=“0.0.0.0”, port=5000)