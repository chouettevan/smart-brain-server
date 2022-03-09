import { ClarifaiStub,grpc } from 'clarifai-nodejs-grpc';
const stub = ClarifaiStub.grpc();
const metadata = new grpc.Metadata();
metadata.set("authorization", "Key d627f7d4e90340b9951c35e41a9cea81");
const handleCall = (req,res) => {
    stub.PostModelOutputs(
        {
            model_id: "a403429f2ddf4b49b307e318f00e528b",
            inputs: [{data: {image: {url: req.body.input}}}]
        },
        metadata,
        (err, response) => {
            if (err) {
                console.log("Error: " + err);
                res.status(400).json('api error')
                return;
            }
    
            if (response.status.code !== 10000) {
                console.log("Received failed status: " + response.status.description + "\n" + response.status.details);
                res.status(400).json('api error')
                return;
            }
            res.json(response);
        }
    );
};
export default handleCall;