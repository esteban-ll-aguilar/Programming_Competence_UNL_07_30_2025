from openai import OpenAI
from app.core.config import _SETTINGS


class OpenAIClient:
    """OpenAI client for interacting with OpenAI API."""

    def __init__(self):
        self.client = OpenAI(
        #     api_key=_SETTINGS.OPENAI_API_KEY,
        #     organization=_SETTINGS.OPENAI_ORGANIZATION
        )

    async def generate_recomendations(self,user_prompt:str="", model: str="gpt-3.5-turbo", message:str = "", **kwargs) -> dict:
        """
        Create a chat completion using OpenAI's API.

        Args:
            model (str): The model to use for the chat completion.
            messages (list): List of messages to send in the chat.
            **kwargs: Additional parameters for the chat completion.

        Returns:
            dict: The response from the OpenAI API.
        """
        if user_prompt is None:
            user_prompt = "Eres un experto recomendando acciones simulando un comportamiento inteligente: /" \
            "- Como eliminar objetos repetidos con el mismo nombre, tipo y tamaño en un cajón./" \
            "- Como ordenar los objetos por tipo o tamanio de cajon./" \
            "- Retornar mensajes de advertencia o sucess  como por ejemplo: 'No se encontraron objetos duplicados.'./" \
            "- Generar recomendaciones automaticas que ayuden al usuario a mantener  sus cajones organizados y optimizados en base al analisis de la informacion del cajon siguiendo las siguientes 3 reglas:" \
            "1. No repetir objetos con el mismo nombre, tipo y tamaño en un cajón." \
            "2. Ordenar los objetos por tipo o tamaño de cajón." \
            "3. Retornar mensajes de advertencia o éxito como por ejemplo: 'No se encontraron objetos duplicados.'./"\
            "- Tambien puedes conversar sobre el usuario de como ayudarlo a organizar"\
            "- Salida de datos esperada un JSON en formato:" \
            "{\n" \
            "    \"recomendaciones\": [\n" \
            "        \"Eliminar objetos duplicados\",\n" \
            "        \"Ordenar objetos por tipo o tamaño\"\n" \
            "    ],\n" \
            "    \"mensajes\": [\n" \
            "        \"No se encontraron objetos duplicados.\"\n" \
            "    ],\n" \
            "    \"acciones\": {\n" \
            "        \"eliminar_duplicados\": true,\n" \
            "        \"ordenar_por_tipo\": true,\n" \
            "        \"ordenar_por_tamanio\": true\n" \
            "    }\n" \
            "}"


        return await self.client.chat.completions.create(
            model=model,
            messages=[{"role": "system", "content": user_prompt},
                      {"role": "user", "content": message}],
            **kwargs
        )
    

