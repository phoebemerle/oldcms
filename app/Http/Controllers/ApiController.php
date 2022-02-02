<?php namespace App\Http\Controllers;

use App\Services\HttpService\EndpointNotReachableException;
use App\Services\HttpService\HttpService;
use Illuminate\Http\Request;

class ApiController extends Controller {

    /**
     * @var HttpService
     */
    private $httpService;

    public function __construct(HttpService $httpService)
    {
        $this->httpService = $httpService;
    }

    public function inventory(Request $request, string $endPoint = null)
    {
        $endPoint = rtrim(config('endpoints.inventory'), '/') . '/' . $endPoint;
        return $this->relay($request, $endPoint);
    }

    public function catalogue(Request $request, string $endPoint = null)
    {
        $endPoint = rtrim(config('endpoints.catalogue'), '/') . '/' . $endPoint;
        return $this->relay($request, $endPoint);
    }

    public function marketing(Request $request, string $endPoint = null)
    {
        $endPoint = rtrim(config('endpoints.marketing'), '/') . '/' . $endPoint;
        return $this->relay($request, $endPoint);
    }

    public function cdn(Request $request, string $endPoint = null)
    {
        $endPoint = rtrim(config('endpoints.cdn'), '/') . '/' . $endPoint;
        return $this->relay($request, $endPoint);
    }

    public function accounts(Request $request, string $endPoint = null)
    {
        $endPoint = rtrim(config('endpoints.accounts'), '/') . '/' . $endPoint;
        return $this->relay($request, $endPoint);
    }

    private function relay(Request $request, string $endPoint)
    {
        try
        {
            if ($request->getQueryString()) $endPoint .= '?' . $request->getQueryString();
            switch ($request->method())
            {
                case 'GET':
                    return $this->httpService->get($endPoint, $request->all(), $request->method())->response();
                case 'DELETE':
                    return $this->httpService->delete($endPoint, $request->all(), $request->method())->response();
                case 'POST':
                    return $this->httpService->post($endPoint, $request->all(), $request->method())->response();
                case 'PUT':
                case 'PATCH':
                    $parameters = $request->all();

                    if ($parameters['file'] ?? null && $request->hasFile('file'))
                        return $this->httpService->postFile($endPoint, $request->file('file'))->response();

                    return $this->httpService->post($endPoint, $request->all(), $request->method())->response();
                default:
                    return abort(404);
            }
        }
        catch (EndpointNotReachableException $e)
        {
            return abort($e->getCode());
        }
    }

    // Get Search URL
    public function GetSearchURLStaging() {
        return response()->json(env('SEARCH_URL_STAGING', ''));
    }

    public function GetSearchURLProduction() {
        return response()->json(env('SEARCH_URL_PRODUCTION', ''));
    }
}