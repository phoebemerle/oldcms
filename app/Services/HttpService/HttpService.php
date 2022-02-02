<?php namespace App\Services\HttpService;

use Symfony\Component\HttpFoundation\File\UploadedFile;

interface HttpService {

    /**
     * @param string $url
     * @param array $parameters
     * @param string $method
     * @return HttpResponse
     * @throws EndpointNotReachableException
     */
    public function get(string $url, array $parameters = [], string $method = 'GET'): HttpResponse;

    /**
     * @param string $url
     * @param array $parameters
     * @param string $method
     * @return HttpResponse
     * @throws EndpointNotReachableException
     */
    public function post(string $url, array $parameters = [], string $method = 'POST'): HttpResponse;

    public function patch(string $url, array $parameters = [], string $method = 'PATCH'): HttpResponse;

    public function delete(string $url, array $parameters = [], string $method = 'DELETE'): HttpResponse;

    /**
     * @param string $url
     * @param $file
     * @return HttpResponse
     */
    public function postFile(string $url, UploadedFile $file): HttpResponse;

}