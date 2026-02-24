bling.js
export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Método não permitido" });
    }

    try {
        const pedido = req.body;

        console.log("Pedido recebido no backend:", pedido);

        // 🔥 Aqui futuramente entra chamada real da API do Bling

        return res.status(200).json({
            success: true,
            message: "Pedido recebido no backend com sucesso."
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
}