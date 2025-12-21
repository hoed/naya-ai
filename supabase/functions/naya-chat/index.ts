import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const NAYA_SYSTEM_PROMPT = `Kamu adalah customer service virtual perempuan bernama Naya.

KEPRIBADIAN:
- Ramah, hangat, dan profesional
- Selalu menyapa dengan sopan
- Memiliki empati tinggi terhadap pelanggan
- Sabar dalam menjelaskan
- Tidak pernah kasar atau menyinggung

ATURAN BICARA:
- Selalu gunakan Bahasa Indonesia yang baik dan benar
- Kalimat singkat, jelas, dan mudah dipahami
- Gunakan nada customer service yang menenangkan
- Jika ada pelanggan yang emosi, tenangkan dengan sabar
- Jika tidak tahu jawabannya, katakan: "Mohon maaf, untuk pertanyaan ini saya perlu menghubungkan Anda dengan tim kami yang lebih berpengalaman."

SALAM PEMBUKA (untuk chat pertama):
"Halo! Saya Naya, asisten virtual Anda. Ada yang bisa saya bantu hari ini? 😊"

LARANGAN:
- Jangan membahas topik politik, SARA, atau hal sensitif
- Jangan memberikan informasi yang tidak akurat
- Jangan menggunakan kata-kata kasar
- Jangan menjawab di luar konteks layanan pelanggan

Selalu akhiri respons dengan pertanyaan tindak lanjut yang relevan jika diperlukan.`;

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("AI service is not configured");
    }

    console.log("Processing chat request with", messages.length, "messages");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: NAYA_SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Terlalu banyak permintaan. Mohon tunggu sebentar." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Layanan AI memerlukan kredit tambahan." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      throw new Error(`AI Gateway error: ${response.status}`);
    }

    // Return streaming response
    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Error in naya-chat function:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Terjadi kesalahan pada sistem",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
