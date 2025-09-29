export const viewComfyRules = [
  {
    title: "ViewComfy API Rules",
    tags: ["Python"],
    slug: "viewcomfy-API-rules",
    content: `
You are an expert in Python, FastAPI integrations and web app development. You are tasked with helping integrate the ViewComfy API into web applications using Python.

The ViewComfy API is a serverless API built using the FastAPI framework that can run custom ComfyUI workflows. The Python version makes requests using the httpx library,

When implementing the API, remember that the first time you call it, you might experience a cold start. Moreover, generation times can vary between workflows; some might be less than 2 seconds, while some might take several minutes.

When calling the API, the params object can't be empty. If nothing else is specified, change the seed value.

The data comes back from the API with the following format: { "prompt_id": "string", # Unique identifier for the prompt "status": "string", # Current execution status "completed": bool, # Whether execution is complete "execution_time_seconds": float, # Time taken to execute "prompt": dict, # Original prompt configuration "outputs": [ # List of output files (optional) { "filename": "string", # Name of the output file "content_type": "string", # MIME type of the file "data": "string", # Base64 encoded file content "size": int # File size in bytes }, # ... potentially multiple output files ] }

ViewComfy documentation:

================================================
FILE: other_resources/guide_to_setting_up_and_using_ViewComfy_API.md
================================================
Deploying your workflow
The first thing you will need to do is to deploy your ComfyUI workflow on your ViewComfy dashboard using the workflow_api.json file.

Calling the workflow with the API
The ViewComfy API is a REST API that can be called with a standard POST request but also supports streaming responses via Server-Sent Events. This second option allows for real-time tracking of the ComfyUI logs.

Getting your API keys
In order to use your API endpoint, you will first need to create your API keys from the ViewComfy dashboard.

2. Extracting your workflow parameters

Before setting up the request is to identify the parameters in your workflow. This is done by using ViewComfy_API/Python/workflow_parameters_maker.py from the example API code to flatten your workflow_api.json.


The flattened json file should look like this:

{
"_3-node-class_type-info": "KSampler",
"3-inputs-cfg": 6,

…  

"_6-node-class_type-info": "CLIP Text Encode (Positive Prompt)",  
"6-inputs-clip": [  
    "38",  
    0  
],  
"6-inputs-text": "A woman raising her head with hair blowing in the wind",  

…  

"_52-node-class_type-info": "Load Image",  
"52-inputs-image": "<path_to_my_image>",  

…  
}


This dictionary contains all the parameters in your workflow. The key for each parameter contains the node id from your workflow_api.json file, whether it is an input, and the parameter’s input name. Keys that start with “_” are just there to give you context on the node corresponding to id, they are not parameters.

In this example, the first key-value pair shows that node 3 is the KSampler and that “3-inputs-cfg” sets its corresponding cfg value.

**3. Updating the script with your parameter**

First thing to do is to copy the ViewComfy endpoint from your dashboard and set it to view_comfy_api_url. You should also get the “Client ID” and “Client Secret” you made earlier, and set the client_id and client_secret values:

view_comfy_api_url = "<Your_ViewComfy_endpoint>"
client_id = "<Your_ViewComfy_client_id>"
client_secret = "<Your_ViewComfy_client_secret>"


You can then set the parameters using the keys from the json file you created in the previous step. In this example, we will change the prompt and the input image:

params = {}
params["6-inputs-text"] = "A flamingo dancing on top of a server in a pink universe, masterpiece, best quality, very aesthetic"
params["52-inputs-image"] = open("/home/gbieler/GitHub/API_tests/input_img.png", "rb")


**4. Calling the API**

Once you are done adding your parameters to ViewComfy_API/Python/main.py, you can call the API by running:

python main.py


This will send your parameters to ViewComfy_API/Python/api.py where all the functions to call the API and handle the outputs are stored.

By default the script runs the “infer_with_logs” function which returns the generation logs from ComfyUI via a streaming response. If you would rather call the API via a standard POST request, you can use “infer” instead.

The result object returned by the API will contain the workflow outputs as well as the generation details.

Your outputs will automatically be saved in your working directory.

================================================
FILE: ViewComfy_API/README.MD
================================================
# ViewComfy API Example

## API

All the functions to call the API and handle the responses are in the api file (api.py). The main file (main.py) takes in the parameters that are specific from your workflow and in most cases will be the only file you need to edit.

#### The API file has two endpoints:

- infer: classic request-response endpoint where you wait for your request to finish before getting results back. 

- infer_with_logs: receives real-time updates with the ComfyUI logs (eg. progress bar). To make use of this endpoint, you need to pass a function that will be called each time a log message is received.

The endpoints can also take a workflow_api.json as a parameter. This is useful if you want to run a different workflow than the one you used when deploying.

### Get your API parameters

To extract all the parameters from your workflow_api.json, you can run the workflow_api_parameter_creator function. This will create a dictionary with all of the parameters inside the workflow.

\`\`\`python

python workflow_parameters_maker.py --workflow_api_path "<Path to your workflow_api.json file>"

Running the example
Install the dependencies:


pip install -r requirements.txt

Add your endpoint and set your API keys:

Change the view_comfy_api_url value inside main.py to the ViewComfy endpoint from your ViewComfy Dashboard. Do the same with the "client_id" and "client_secret" values using your API keys (you can also get them from your dashboard). If you want, you can change the parameters of the workflow inside main.py at the same time.

Call the API:


python main.py

Using the API with a different workflow
You can overwrite the default workflow_api.json when sending a request. Be careful if you need to install new node packs to run the new workflow. Having too many custom node packages can create some issues between the Python packages. This can increase ComfyUI start up time and in some cases break the ComfyUI installation.

To use an updated workflow (that works with your deployment) with the API, you can send the new workflow_api.json as a parameter by changing the override_workflow_api_path value. For example, using python:

override_workflow_api_path = "<path_to_your_new_workflow_api_file>"
================================================ FILE: ViewComfy_API/example_workflow/workflow_api(example).json
{ "3": { "inputs": { "seed": 268261030599666, "steps": 20, "cfg": 6, "sampler_name": "uni_pc", "scheduler": "simple", "denoise": 1, "model": [ "56", 0 ], "positive": [ "50", 0 ], "negative": [ "50", 1 ], "latent_image": [ "50", 2 ] }, "class_type": "KSampler", "_meta": { "title": "KSampler" } }, "6": { "inputs": { "text": "A flamingo dancing on top of a server in a pink universe, masterpiece, best quality, very aesthetic", "clip": [ "38", 0 ] }, "class_type": "CLIPTextEncode", "_meta": { "title": "CLIP Text Encode (Positive Prompt)" } }, "7": { "inputs": { "text": "Overexposure, static, blurred details, subtitles, paintings, pictures, still, overall gray, worst quality, low quality, JPEG compression residue, ugly, mutilated, redundant fingers, poorly painted hands, poorly painted faces, deformed, disfigured, deformed limbs, fused fingers, cluttered background, three legs, a lot of people in the background, upside down", "clip": [ "38", 0 ] }, "class_type": "CLIPTextEncode", "_meta": { "title": "CLIP Text Encode (Negative Prompt)" } },

...

"52": { "inputs": { "image": "SMT54Y6XHY1977QPBESY72WSR0.jpeg", "upload": "image" }, "class_type": "LoadImage", "_meta": { "title": "Load Image" } },

...

}

================================================ FILE: ViewComfy_API/Python/api.py
import json from io import BufferedReader from typing import Any, Callable, Dict, List import httpx

class FileOutput: """Represents a file output with its content encoded in base64"""

def __init__(self, filename: str, content_type: str, data: str, size: int):
    """
    Initialize a FileOutput object.

    Args:
        filename (str): Name of the output file
        content_type (str): MIME type of the file
        data (str): Base64 encoded file content
        size (int): Size of the file in bytes
    """
    self.filename = filename
    self.content_type = content_type
    self.data = data
    self.size = size
class PromptResult: def init( self, prompt_id: str, status: str, completed: bool, execution_time_seconds: float, prompt: Dict, outputs: List[Dict] | None = None, ): """ Initialize a PromptResult object.

    Args:
        prompt_id (str): Unique identifier for the prompt
        status (str): Current status of the prompt execution
        completed (bool): Whether the prompt execution is complete
        execution_time_seconds (float): Time taken to execute the prompt
        prompt (Dict): The original prompt configuration
        outputs (List[Dict], optional): List of output file data. Defaults to empty list.
    """
    self.prompt_id = prompt_id
    self.status = status
    self.completed = completed
    self.execution_time_seconds = execution_time_seconds
    self.prompt = prompt

    # Initialize outputs as FileOutput objects
    self.outputs = []
    if outputs:
        for output_data in outputs:
            self.outputs.append(
                FileOutput(
                    filename=output_data.get("filename", ""),
                    content_type=output_data.get("content_type", ""),
                    data=output_data.get("data", ""),
                    size=output_data.get("size", 0),
                )
            )
class ComfyAPIClient: def init( self, *, infer_url: str | None = None, client_id: str | None = None, client_secret: str | None = None, ): """ Initialize the ComfyAPI client with the server URL.

    Args:
        base_url (str): The base URL of the API server
    """
    if infer_url is None:
        raise Exception("infer_url is required")
    self.infer_url = infer_url

    if client_id is None:
        raise Exception("client_id is required")

    if client_secret is None:
        raise Exception("client_secret is required")

    self.client_id = client_id
    self.client_secret = client_secret

async def infer(
    self,
    *,
    data: Dict[str, Any],
    files: list[tuple[str, BufferedReader]] = [],
) -> Dict[str, Any]:
    """
    Make a POST request to the /api/infer-files endpoint with files encoded in form data.

    Args:
        data: Dictionary of form fields (logs, params, etc.)
        files: Dictionary mapping file keys to tuples of (filename, content, content_type)
               Example: {"composition_image": ("image.jpg", file_content, "image/jpeg")}

    Returns:
        Dict[str, Any]: Response from the server
    """

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                self.infer_url,
                data=data,
                files=files,
                timeout=httpx.Timeout(2400.0),
                follow_redirects=True,
                headers={
                    "client_id": self.client_id,
                    "client_secret": self.client_secret,
                },
            )

            if response.status_code == 201:
                return response.json()
            else:
                error_text = response.text
                raise Exception(
                    f"API request failed with status {response.status_code}: {error_text}"
                )
        except httpx.HTTPError as e:
            raise Exception(f"Connection error: {str(e)}")
        except Exception as e:
            raise Exception(f"Error during API call: {str(e)}")

async def consume_event_source(
    self, *, response, logging_callback: Callable[[str], None]
) -> Dict[str, Any] | None:
    """
    Process a streaming Server-Sent Events (SSE) response.

    Args:
        response: An active httpx streaming response object

    Returns:
        List of parsed event objects
    """
    current_data = ""
    current_event = "message"  # Default event type

    prompt_result = None
    # Process the response as it streams in
    async for line in response.aiter_lines():
        line = line.strip()
        if prompt_result:
            break
        # Empty line signals the end of an event
        if not line:
            if current_data:
                try:
                    if current_event in ["log_message", "error"]:
                        logging_callback(f"{current_event}: {current_data}")
                    elif current_event == "prompt_result":
                        prompt_result = json.loads(current_data)
                    else:
                        print(
                            f"Unknown event: {current_event}, data: {current_data}"
                        )
                except json.JSONDecodeError as e:
                    print("Invalid JSON: ...")
                    print(e)
                # Reset for next event
                current_data = ""
                current_event = "message"
            continue

        # Parse SSE fields
        if line.startswith("event:"):
            current_event = line[6:].strip()
        elif line.startswith("data:"):
            current_data = line[5:].strip()
        elif line.startswith("id:"):
            # Handle event ID if needed
            pass
        elif line.startswith("retry:"):
            # Handle retry directive if needed
            pass
    return prompt_result

async def infer_with_logs(
    self,
    *,
    data: Dict[str, Any],
    logging_callback: Callable[[str], None],
    files: list[tuple[str, BufferedReader]] = [],
) -> Dict[str, Any] | None:
    if data.get("logs") is not True:
        raise Exception("Set the logs to True for streaming the process logs")

    async with httpx.AsyncClient() as client:
        try:
            async with client.stream(
                "POST",
                self.infer_url,
                data=data,
                files=files,
                timeout=24000,
                follow_redirects=True,
                headers={
                    "client_id": self.client_id,
                    "client_secret": self.client_secret,
                },
            ) as response:
                if response.status_code == 201:
                    # Check if it's actually a server-sent event stream
                    if "text/event-stream" in response.headers.get(
                        "content-type", ""
                    ):
                        prompt_result = await self.consume_event_source(
                            response=response, logging_callback=logging_callback
                        )
                        return prompt_result
                    else:
                        # For non-SSE responses, read the content normally
                        raise Exception(
                            "Set the logs to True for streaming the process logs"
                        )
                else:
                    error_response = await response.aread()
                    error_data = json.loads(error_response)
                    raise Exception(
                        f"API request failed with status {response.status_code}: {error_data}"
                    )
        except Exception as e:
            raise Exception(f"Error with streaming request: {str(e)}")
def parse_parameters(params: dict): """ Parse parameters from a dictionary to a format suitable for the API call.

Args:
    params (dict): Dictionary of parameters

Returns:
    dict: Parsed parameters
"""
parsed_params = {}
files = []
for key, value in params.items():
    if isinstance(value, BufferedReader):
        files.append((key, value))
    else:
        parsed_params[key] = value
return parsed_params, files
async def infer( *, params: Dict[str, Any], api_url: str, override_workflow_api: Dict[str, Any] | None = None, client_id: str, client_secret: str, ): """ Make an inference with real-time logs from the execution prompt

Args:
    api_url (str): The URL to send the request to
    params (dict): The parameter to send to the workflow
    override_workflow_api (dict): Optional override the default workflow_api of the deployment

Returns:
    PromptResult: The result of the inference containing outputs and execution details
"""
client = ComfyAPIClient(
    infer_url=api_url,
    client_id=client_id,
    client_secret=client_secret,
)

params_parsed, files = parse_parameters(params)
data = {
    "logs": False,
    "params": json.dumps(params_parsed),
    "workflow_api": json.dumps(override_workflow_api)
    if override_workflow_api
    else None,
}

# Make the API call
result = await client.infer(data=data, files=files)

return PromptResult(**result)
async def infer_with_logs( *, params: Dict[str, Any], logging_callback: Callable[[str], None], api_url: str, override_workflow_api: Dict[str, Any] | None = None, client_id: str, client_secret: str, ): """ Make an inference with real-time logs from the execution prompt

Args:
    api_url (str): The URL to send the request to
    params (dict): The parameter to send to the workflow
    override_workflow_api (dict): Optional override the default workflow_api of the deployment
    logging_callback (Callable[[str], None]): The callback function to handle logging messages

Returns:
    PromptResult: The result of the inference containing outputs and execution details
"""

client = ComfyAPIClient(
    infer_url=api_url,
    client_id=client_id,
    client_secret=client_secret,
)

params_parsed, files = parse_parameters(params)
data = {
    "logs": True,
    "params": json.dumps(params_parsed),
    "workflow_api": json.dumps(override_workflow_api)
    if override_workflow_api
    else None,
}

# Make the API call
result = await client.infer_with_logs(
    data=data,
    files=files,
    logging_callback=logging_callback,
)

if result:
    return PromptResult(**result)
\`\`\`
FILE: ViewComfy_API/Python/main.py
\`\`\`python
import asyncio import base64 import json import os from api import infer, infer_with_logs

async def api_examples():

view_comfy_api_url = "<Your_ViewComfy_endpoint>"
client_id = "<Your_ViewComfy_client_id>"
client_secret = "<Your_ViewComfy_client_secret>"

override_workflow_api_path = None # Advanced feature: overwrite default workflow with a new one

# Set parameters
params = {}

params["6-inputs-text"] = "A cat sorcerer"
params["52-inputs-image"] = open("input_folder/input_img.png", "rb")

override_workflow_api = None
if  override_workflow_api_path:
    if os.path.exists(override_workflow_api_path):  
        with open(override_workflow_api_path, "r") as f:
            override_workflow_api = json.load(f)
    else:
        print(f"Error: {override_workflow_api_path} does not exist")

def logging_callback(log_message: str):
    print(log_message)

# Call the API and wait for the results
# try:
#     prompt_result = await infer(
#         api_url=view_comfy_api_url,
#         params=params,
#         client_id=client_id,
#         client_secret=client_secret,
#     )
# except Exception as e:
#     print("something went wrong calling the api")
#     print(f"Error: {e}")
#     return

# Call the API and get the logs of the execution in real time
# you can use any function that you want
try:
    prompt_result = await infer_with_logs(
        api_url=view_comfy_api_url,
        params=params,
        logging_callback=logging_callback,
        client_id=client_id,
        client_secret=client_secret,
        override_workflow_api=override_workflow_api,
    )
except Exception as e:
    print("something went wrong calling the api")
    print(f"Error: {e}")
    return

if not prompt_result:
    print("No prompt_result generated")
    return

for file in prompt_result.outputs:
    try:
        # Decode the base64 data before writing to file
        binary_data = base64.b64decode(file.data)
        with open(file.filename, "wb") as f:
            f.write(binary_data)
        print(f"Successfully saved {file.filename}")
    except Exception as e:
        print(f"Error saving {file.filename}: {str(e)}")
if name == "main": asyncio.run(api_examples())
\`\`\`

================================================ 
FILE: ViewComfy_API/Python/requirements.txt
\`\`\`
httpx==0.28.1
\`\`\`

================================================ 
FILE: ViewComfy_API/Python/workflow_api_parameter_creator.py
\`\`\`python
from typing import Dict, Any

def workflow_api_parameters_creator(workflow: Dict[str, Dict[str, Any]]) -> Dict[str, Any]: """ Flattens the workflow API JSON structure into a simple key-value object

Args:
    workflow: The workflow API JSON object

Returns:
    A flattened object with keys in the format "nodeId-inputs-paramName" or "nodeId-class_type-info"
"""
flattened: Dict[str, Any] = {}

# Iterate through each node in the workflow
for node_id, node in workflow.items():
    # Add the class_type-info key, preferring _meta.title if available
    class_type_info = node.get("_meta", {}).get("title") or node.get("class_type")
    flattened[f"_{node_id}-node-class_type-info"] = class_type_info
    
    # Process all inputs
    if "inputs" in node:
        for input_key, input_value in node["inputs"].items():
            flattened[f"{node_id}-inputs-{input_key}"] = input_value

return flattened
""" Example usage:

import json

with open('workflow_api.json', 'r') as f: workflow_json = json.load(f)

flattened = create_workflow_api_parameters(workflow_json) print(flattened) """
\`\`\`

================================================ 
FILE: ViewComfy_API/Python/workflow_parameters_maker.py
\`\`\`python
import json from workflow_api_parameter_creator import workflow_api_parameters_creator import argparse

parser = argparse.ArgumentParser(description='Process workflow API parameters') parser.add_argument('--workflow_api_path', type=str, required=True, help='Path to the workflow API JSON file')

Parse arguments
args = parser.parse_args()

with open(args.workflow_api_path, 'r') as f: workflow_json = json.load(f)

parameters = workflow_api_parameters_creator(workflow_json)

with open('workflow_api_parameters.json', 'w') as f: json.dump(parameters, f, indent=4)
\`\`\`
`,
    author: {
      name: "Guillaume Bieler",
      url: "https://x.com/GuillaumeBiele",
      avatar: "https://avatars.githubusercontent.com/u/176300844?v=4",
    },
  },
];
