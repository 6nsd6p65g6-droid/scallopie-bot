"""
بوت خدمة عملاء مطعم سكالوبي - تاجوراء
شخصية: شاب ليبي طبيعي يرد على المكالمات
"""

from flask import Flask, request, Response
from twilio.twiml.voice_response import VoiceResponse, Gather
import anthropic
import os

app = Flask(__name__)

ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY", "your_anthropic_key_here")
STAFF_NUMBER = os.environ.get("STAFF_NUMBER", "+218xxxxxxxxx")

client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

MENU = """
=== قائمة مطعم سكالوبي - تاجوراء ===
كل الأصناف باللحم الوطني

--- السندوتشات ---
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

--- برجر ---
برجر اصلية: 7 دينار
برجر حطب: 14 دينار
برجر موازريلا: 15 دينار
برجر الكينغ: 18 دينار
برجر عملاقة عادية: 12 دينار
برجر عملاقة دبل: 17 دينار

--- الوجبات ---
وجبة ستربس 5 قطع: 23 دينار
وجبة وينجز 7 قطع: 22 دينار
وجبة سوبر ايزو: 18 دينار
وجبة مكسيكانو: 22 دينار

--- بيتزا ---
بيتزا مرجريتا: 12 دينار
بيتزا خضرة: 13 دينار
بيتزا اجبان: 17 دينار
بيتزا دجاج: 18 دينار
بيتزا تن: 16 دينار

--- معجنات ---
مقلوبة: 12 دينار
باقيت: 15 دينار
كلازوني: 16 دينار
ليباني: 17 دينار

--- المقبلات الساخنة ---
صحن بطاطا صغير: 6 دينار
صحن بطاطا كبير: 12 دينار
بطاطا ويدجز: 9 دينار
اصابع موزاريلا: 10 دينار
حلقات البصل: 9 دينار

--- الإضافات ---
صوص: 2 دينار
جبنة شرائح: 1 دينار
جبنة موزاريلا: 2 دينار
قطعة ستربس: 4 دينار

--- المشروبات ---
غازي: 3 دينار
قرين: 4 دينار
كركدي: 3 دينار
ليمون ونعناع: 3 دينار
كوكتيل طبيعي: 4 دينار
برتقال فرش: 4 دينار
ماء: 1 دينار
"""

SYSTEM_PROMPT = f"""أنت شاب ليبي تشتغل في مطعم سكالوبي في تاجوراء وبتجاوب على المكالمات.
ما عندكش اسم، لما يسألك أحد قولو "أنا من سكالوبي".
كل الأصناف باللحم الوطني.

=== شخصيتك ===
- شاب ليبي عادي، خفيف الظل، ودي
- تتكلم بالليبي الدارج الحقيقي كأنك تكلم صاحبك على الهاتف
- طبيعي ومريح، مش روبوت
- لما تضحك تقول "هههه" أو "هاه"
- لما توافق تقول "إيه" أو "أيوه" مش "نعم"
- لما تتفاجأ تقول "آه والله؟"

=== قواعد المحادثة ===
- ردودك قصيرة وطبيعية كأنك فعلاً على الهاتف
- ما تقرأش القائمة كلها دفعة وحدة أبداً
- استخدم "توا" مش "هسا"
- استخدم "مليح" لما تبي تقول كويس
- استخدم "شني" للسؤال مش "واش" أو "ماذا" أو "هل"
- استخدم "بالزبط" مش "بالضبط"
- استخدم "خلاص" بمعنى تمام أو أوك

=== كيف ترد على حسب شن يطلب الزبون ===
لو سأل "شنو عندكم": قولو "شن تبي بالزبط انتا؟ في سندوتشات، برجر، بيتزا، وجبات، معجنات، مقبلات"
لو سأل عن السندوتشات: عددهم بأسعارهم
لو سأل عن البرجر: عددو بأسعاره
لو سأل عن الوجبات: عددها بأسعارها
لو سأل عن البيتزا: عددها بأسعارها
لو سأل عن المعجنات: عددها بأسعارها
لو سأل عن المقبلات: عددها بأسعارها
لو سأل عن صنف محدد: قولو سعره مباشرة

=== التوصيل ===
لما يسأل عن التوصيل:
1. اسألو "وين مكانك؟"
2. بعد ما يقول قولو "استنى شوية نأكدلك"
3. ما تعدش بالتوصيل قبل التأكيد

=== القائمة ===
{MENU}

=== أمثلة ===
- "سلام عليكم مطعم سكالوبي تفضل"
- "شن تبي بالزبط انتا؟"
- "السكالوب خبزة بـ 12 دينار"
- "التوصيل؟ وين مكانك؟"
- "استنى شوية نأكدلك"
- "مفهمتكش خوي، عيد عليا"
- "إيه تمام، حاجة تانية؟"
- "تمام، الطلبية ديمه نص ساعة"
- "مع السلامة، في امان الله"
"""

conversations = {}
delivery_requests = {}


def get_ai_response(user_message: str, conversation_history: list) -> tuple[str, bool]:
    try:
        detection_prompt = SYSTEM_PROMPT + """
مهم: لما تحتاج تتأكد من التوصيل، ضيف في آخر ردك:
[NEEDS_DELIVERY_CHECK: اسم المنطقة]
"""
        messages = conversation_history + [{"role": "user", "content": user_message}]
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=300,
            system=detection_prompt,
            messages=messages
        )
        full_reply = response.content[0].text
        needs_check = "[NEEDS_DELIVERY_CHECK:" in full_reply
        clean_reply = full_reply.split("[NEEDS_DELIVERY_CHECK:")[0].strip()
        return clean_reply, needs_check
    except Exception as e:
        return "آسف سامحني، صار مشكلة تقنية. ارجع اتصل توا.", False


def notify_staff_for_delivery(call_sid: str, location: str):
    try:
        from twilio.rest import Client
        twilio_client = Client(
            os.environ.get("TWILIO_ACCOUNT_SID"),
            os.environ.get("TWILIO_AUTH_TOKEN")
        )
        twilio_client.messages.create(
            body=f"زبون يسأل عن توصيل لـ: {location}",
            from_=os.environ.get("TWILIO_PHONE_NUMBER"),
            to=STAFF_NUMBER
        )
        delivery_requests[call_sid] = {"location": location, "confirmed": False}
    except Exception as e:
        print(f"فشل الإشعار: {e}")


@app.route("/voice/incoming", methods=["POST"])
def incoming_call():
    call_sid = request.form.get("CallSid", "unknown")
    conversations[call_sid] = []
    response = VoiceResponse()
    gather = Gather(
        input="speech",
        action=f"/voice/respond?call_sid={call_sid}",
        method="POST",
        language="ar-SA",
        speech_timeout="auto",
        timeout=6
    )
    gather.say("سلام عليكم مطعم سكالوبي تفضل", language="ar-SA", voice="Polly.Zeina")
    response.append(gather)
    response.say("الو؟ ما سمعتك، جرب مرة ثانية", language="ar-SA", voice="Polly.Zeina")
    response.redirect("/voice/incoming")
    return Response(str(response), mimetype="text/xml")


@app.route("/voice/respond", methods=["POST"])
def respond():
    call_sid = request.args.get("call_sid", "unknown")
    speech_result = request.form.get("SpeechResult", "")
    response = VoiceResponse()

    if not speech_result:
        gather = Gather(
            input="speech",
            action=f"/voice/respond?call_sid={call_sid}",
            method="POST",
            language="ar-SA",
            speech_timeout="auto",
            timeout=5
        )
        gather.say("مفهمتكش، عيد عليا من فضلك", language="ar-SA", voice="Polly.Zeina")
        response.append(gather)
        return Response(str(response), mimetype="text/xml")

    history = conversations.get(call_sid, [])
    ai_reply, needs_delivery_check = get_ai_response(speech_result, history)
    history.append({"role": "user", "content": speech_result})
    history.append({"role": "assistant", "content": ai_reply})
    conversations[call_sid] = history[-14:]

    if needs_delivery_check:
        notify_staff_for_delivery(call_sid, speech_result)

    end_keywords = ["مع السلامة", "باي", "يسلمك", "في امان الله", "وداع", "خلاص"]
    if any(word in speech_result for word in end_keywords):
        response.say(ai_reply, language="ar-SA", voice="Polly.Zeina")
        response.say("مع السلامة، في امان الله، نورتونا", language="ar-SA", voice="Polly.Zeina")
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
        response.say("الو؟ غير شي تبي تعرفو؟", language="ar-SA", voice="Polly.Zeina")
        response.hangup()

    return Response(str(response), mimetype="text/xml")


@app.route("/voice/status", methods=["POST"])
def call_status():
    call_sid = request.form.get("CallSid", "")
    status = request.form.get("CallStatus", "")
    if status in ["completed", "failed", "busy", "no-answer"]:
        conversations.pop(call_sid, None)
        delivery_requests.pop(call_sid, None)
    return "", 204


@app.route("/health")
def health():
    return {"status": "يشتغل", "مطعم": "سكالوبي تاجوراء"}


if __name__ == "__main__":
    print("بوت مطعم سكالوبي - تاجوراء")
    app.run(debug=False, host="0.0.0.0", port=5000)
