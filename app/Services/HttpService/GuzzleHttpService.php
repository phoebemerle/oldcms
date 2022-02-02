<?php namespace App\Services\HttpService;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;
use GuzzleHttp\Exception\ConnectException;
use GuzzleHttp\Exception\GuzzleException;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class GuzzleHttpService implements HttpService {

    /**
     * @param string $url
     * @param array $parameters
     * @param string $method
     * @return HttpResponse
     * @throws EndpointNotReachableException
     */
    public function get(string $url, array $parameters = [], string $method = 'GET'): HttpResponse
    {
        $options = [
            'query' => $parameters
        ];
        return $this->sendRequest($url, $options, $method);
    }

    public function patch(string $url, array $parameters = [], string $method = 'PATCH'): HttpResponse
    {
        $options = [
            'headers' => [
                'Content-Type' => 'application/vnd.api+json'
            ],
            'json' => $parameters
        ];
        return $this->sendRequest($url, $options, $method);
    }

    public function delete(string $url, array $parameters = [], string $method = 'DELETE'): HttpResponse
    {
        $options = [
            'headers' => [
                'Content-Type' => 'application/vnd.api+json'
            ],
            'json' => $parameters
        ];
        return $this->sendRequest($url, $options, $method);
    }


    /**
     * @param string $url
     * @param array $parameters
     * @param string $method
     * @return HttpResponse
     * @throws EndpointNotReachableException
     */
    public function post(string $url, array $parameters = [], string $method = 'POST'): HttpResponse
    {
        $options = [
            'headers' => [
                'Content-Type' => 'application/vnd.api+json'
            ],
            'json' => $parameters
        ];
        return $this->sendRequest($url, $options, $method);
    }

    /**
     * @param string $url
     * @param UploadedFile $file
     * @return HttpResponse
     * @throws EndpointNotReachableException
     */
    public function postFile(string $url, UploadedFile $file): HttpResponse
    {
        $options = [
            'multipart' => [
                [
                    'name' => 'file',
                    'contents' => fopen($file->getRealPath(), 'r'),
                    'filename' => $file->getClientOriginalName()
                ]
            ]
        ];

        return $this->sendRequest($url, $options, 'POST');
    }

    /**
     * @param string $url
     * @param array $options
     * @param string $method
     * @return mixed
     * @throws EndpointNotReachableException
     */
    private function sendRequest(string $url, array $options, string $method = 'POST')
    {
        try
        {
            $client = new Client();
            $response = $client->request($method, $url, $options);

            return new HttpResponse($response->getStatusCode(), (string)$response->getBody());
        }
        catch (ConnectException $e)
        {
            throw new EndpointNotReachableException('URL is not reachable. ' . $e->getMessage(), $e->getCode(), $e->getPrevious());
        }
        catch (ClientException $e)
        {
            throw new EndpointNotReachableException('URL is invalid. ' . $e->getMessage(), $e->getCode(), $e->getPrevious());
        }
        catch (GuzzleException $e)
        {
            throw new EndpointNotReachableException($e->getMessage(), $e->getCode(), $e->getPrevious());
        }
        catch (\Exception $e)
        {
            throw new EndpointNotReachableException('Unknown error in http connection - ' . $e->getMessage());
        }
    }
}