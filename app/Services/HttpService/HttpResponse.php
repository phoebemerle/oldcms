<?php namespace App\Services\HttpService;

class HttpResponse {

    /**
     * @var int
     */
    private $responseCode;

    /**
     * @var string
     */
    private $body;

    /**
     * @param int $responseCode
     * @param string $body
     */
    public function __construct(int $responseCode, string $body)
    {
        $this->responseCode = $responseCode;
        $this->body = $body;
    }

    /**
     * @return array
     */
    public function response(): array
    {
        $result = @json_decode($this->body, true);
        if (json_last_error() == JSON_ERROR_NONE) return $result;

        return [];
    }

    /**
     * @return string
     */
    public function rawResponse(): string
    {
        return $this->body;
    }

    /**
     * @return int
     */
    public function responseCode(): int
    {
        return $this->responseCode;
    }

}