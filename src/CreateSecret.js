import {
  RadioGroup, Switch, Dialog, Transition,
} from '@headlessui/react';
import { Fragment, useState } from 'react';
import { useCopyToClipboard } from 'react-use';
import { CheckIcon, ClipboardCopyIcon } from '@heroicons/react/outline';
import { encryptMessage, postSecret, randomString } from './lib/secret';
import {useTranslation} from "react-i18next";

export default function CreateSecret() {
  const times = [
    { key: 'hour', value: 3600 },
    { key: 'day', value: 86400 },
    { key: 'week', value: 604800 },
  ];

  const [errors, setErrors] = useState();
  const [plan, setPlan] = useState(3600);
  const [oneTime, setOneTime] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [, copyToClipboard] = useCopyToClipboard();
  const [encryptedUri, setEncryptedUri] = useState('https://');
  const [phrase, setPhrase] = useState('');
  const [copied, setCopied] = useState(false);
  const { t } = useTranslation();

  const submitForm = async () => {
    setProcessing(true);

    if(phrase === '') {
      setErrors(t('createSecret.errors.phraseEmpty'));
      setProcessing(false);
      return false;
    }

    try {
      const pw = randomString();

      const { data } = await postSecret({
        expiration: plan,
        message: await encryptMessage(phrase, pw),
        one_time: oneTime,
      });

      const baseUrl = `${window.location.protocol}//${window.location.host}/#/s`;

      setEncryptedUri(`${baseUrl}/${data.message}/${pw}`);

      setIsOpen(true);
      setProcessing(false);
      setPhrase('');
    } catch (e) {
      setErrors(t('createSecret.errors.creatingFailed'));
      setProcessing(false);
    }
  };

  return (
    <>
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={setIsOpen}
        >
          <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
            </Transition.Child>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
                <div>
                  <div className="flex items-center justify-center w-12 h-12 mx-auto bg-green-100 rounded-full">
                    <CheckIcon
                      className="w-6 h-6 text-green-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-500"
                    >
                      {t('successModal.title')}
                    </Dialog.Title>
                    <div className="my-4">
                      <p className="text-sm text-gray-500">
                        {t('successModal.content')}
                      </p>
                    </div>
                    <div className="flex items-stretch">
                      <button
                        className="flex relative items-center justify-center w-10 h-10 bg-green-200"
                        type="button"
                        onClick={() => {
                          setCopied(true)
                          copyToClipboard(encryptedUri)
                        }}
                      >
                        <ClipboardCopyIcon
                          className="w-6 h-6 text-green-600"
                          aria-hidden="true"
                        />
                        {copied && <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 text-xs whitespace-nowrap bg-gray-600 text-white px-2 py-1 rounded-md">
                          <span className="absolute left-1/2 transform -translate-x-1/2 top-full h-4 w-4 overflow-hidden">
                            <span className=" h-2 w-2 block bg-gray-600 -rotate-45 transform origin-top-left" />
                          </span>
                          {t('successModal.copied')}
                        </span>}
                      </button>
                      <input
                        className="flex-1 w-full text-xs bg-green-50 px-2 outline-none focus:ring-0 focus:border-green-200 active:outline-none"
                        type="text"
                        readOnly
                        value={encryptedUri}
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6">
                  <button
                    type="button"
                    className="inline-flex justify-center w-full font-medium px-4 py-4 text-base font-medium text-white bg-gray-500 border border-transparent rounded-full shadow-sm hover:bg-gray-700 focus:outline-none sm:text-sm"
                    onClick={() => {
                      setCopied(false)
                      setIsOpen(false)
                    }}
                  >
                    {t('successModal.backToVault')}
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <div className="flex items-center justify-center w-full h-screen bg-gray-100">
        <div className="w-full max-w-3xl mx-auto">
          <div className="flex items-center justify-center mb-10">
            <svg width={465} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 465 271">
              <g fill="none" fillRule="evenodd">
                <path fill="#4B5563" fillRule="nonzero" d="M128.078 188.916 155.172 85.37h-11.976l-23.8 93.371h-8.383L49.975 25H38l64.33 163.916h25.748Zm36.118 0 7.484-26.635h44.309L244.092 246h11.377l-49.06-160.63H181.26l-28.442 103.546h11.377Zm51.802-26.643-41.773-10.316 15.718-56.712h7.784l18.27 67.028Zm78.023 27.558c11.91 0 20.915-2.58 27.019-7.738 6.103-5.159 9.155-13.492 9.155-25V85.37H318.88v72.021c0 7.837-2.109 13.517-6.326 17.038-4.218 3.522-10.495 5.283-18.831 5.283-16.077 0-24.116-7.44-24.116-22.32V85.37h-11.462v71.724c0 11.507 3.002 19.84 9.006 24.999 6.004 5.159 14.96 7.738 26.87 7.738Zm112.136-1.488v-10.268h-45.254V85.37H349.44v102.973h56.716Zm27.433 0V95.637H465V85.37h-74.431v10.267h31.708v92.706h11.313Z"/>
                <path fill="#6B7280" fillRule="nonzero" d="m48.335 70.977 5.163 11.57C44.343 96.102 39 112.429 39 130c0 46.96 38.166 85.029 85.245 85.029 34.046 0 63.43-19.91 77.09-48.692l3.715 15.833C187.896 208.55 158.113 226 124.244 226 71.09 226 28 183.02 28 130c0-22.255 7.592-42.742 20.335-59.023ZM124.244 34c33.254 0 62.568 16.822 79.858 42.4l-13.68.001c-15.63-19.177-39.47-31.43-66.178-31.43-18.748 0-36.082 6.037-50.155 16.268l-4.564-10.224C85.062 40.285 103.917 34 124.244 34Z"/>
                <path fill="#D1D5DB" fillRule="nonzero" d="m34.155 45.042 4.842 11.403C21.765 75.89 11.302 101.474 11.302 129.5c0 60.86 49.338 110.198 110.198 110.198 37.097 0 69.913-18.332 89.884-46.43l4.597 12.629C193.707 233.41 159.657 251 121.5 251 54.397 251 0 196.603 0 129.5c0-32.817 13.01-62.595 34.155-84.458ZM121.5 8C188.603 8 243 62.397 243 129.5a121.91 121.91 0 0 1-2.968 26.81l-8.397-23.065c.042-1.243.063-2.492.063-3.745 0-60.86-49.338-110.198-110.198-110.198-20.785 0-40.226 5.755-56.817 15.758l-4.458-10.5C78.214 14.033 99.152 8 121.5 8Z"/>
                <path fill="#4B5563" d="M42 0c7.732 0 14 6.268 14 14s-6.268 14-14 14-14-6.268-14-14S34.268 0 42 0Zm0 5.6c-2.095 0-3.8 1.865-3.8 4.156v1.969h-.6c-.663 0-1.2.588-1.2 1.313v5.25c0 .724.538 1.312 1.2 1.312h8.8c.663 0 1.2-.588 1.2-1.313v-5.25c0-.724-.538-1.312-1.2-1.312h-.6V9.756C45.8 7.465 44.095 5.6 42 5.6Zm0 8.313c.553 0 1 .489 1 1.093v1.313c0 .604-.447 1.094-1 1.094-.553 0-1-.49-1-1.094v-1.313c0-.604.447-1.094 1-1.094Zm0-6.126c.992 0 1.8.884 1.8 1.97v1.968h-3.6V9.756c0-1.085.807-1.969 1.8-1.969ZM251 243c7.732 0 14 6.268 14 14s-6.268 14-14 14-14-6.268-14-14 6.268-14 14-14Zm0 5.6c-2.095 0-3.8 1.865-3.8 4.156v1.969h-.6c-.662 0-1.2.588-1.2 1.313v5.25c0 .724.537 1.312 1.2 1.312h8.8c.662 0 1.2-.588 1.2-1.313v-5.25c0-.724-.538-1.312-1.2-1.312h-.6v-1.969c0-2.291-1.705-4.156-3.8-4.156Zm0 8.313c.553 0 1 .489 1 1.093v1.313c0 .604-.447 1.094-1 1.094-.553 0-1-.49-1-1.094v-1.313c0-.604.447-1.093 1-1.093Zm0-6.126c.993 0 1.8.884 1.8 1.97v1.968h-3.6v-1.969c0-1.085.808-1.969 1.8-1.969Z"/>
              </g>
            </svg>
          </div>
          {errors && (
          <div className="px-4 py-3 mb-4 text-sm text-white bg-red-400 rounded-md">
            {errors}
          </div>
          )}
          <div>
            <div className="mt-1">
              <textarea
                id="password"
                rows={8}
                className="bg-white p-3 focus:outline-none shadow-sm block w-full sm:text-sm border-2 border-gray-500 rounded-md"
                placeholder={t('createSecret.phrasePlaceholder')}
                value={phrase}
                onChange={(e) => setPhrase(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <div>
              <div className="mb-3">
                <div className="text-gray-500 text-lg font-semibold">{t('createSecret.howLong.label')}</div>
                <div className="text-sm text-gray-400">{t('createSecret.howLong.help')}</div>
              </div>

              <RadioGroup
                  className="grid gap-4 grid-flow-col justify-start"
                  value={plan}
                  onChange={setPlan}
              >
                {times
                && times.map((time) => (
                    <RadioGroup.Option
                        key={time.value}
                        className="flex items-center text-gray-500 outline-none cursor-pointer"
                        value={time.value}
                    >
                      {({ checked }) => (
                          <>
                            <div
                                className={`w-4 h-4 mr-2 ring-2 ring-gray-500 rounded-full border-2 border-white ${
                                    checked ? 'bg-gray-500' : ''
                                }`}
                            />
                            {t(`createSecret.howLong.values.${time.key}`)}
                          </>
                      )}
                    </RadioGroup.Option>
                ))}
              </RadioGroup>
            </div>

            <div className="text-right">
              <div className="mb-3">
                <div className="text-gray-500 text-lg font-semibold">{t(`createSecret.oneTime.label`)}</div>
                <div className="text-sm text-gray-400">{t(`createSecret.oneTime.help`)}</div>
              </div>
              <Switch.Group>
                <div className="flex items-center justify-end">
                  <Switch
                      checked={oneTime}
                      onChange={() => setOneTime((r) => !r)}
                      className={`${
                          oneTime ? 'bg-gray-500' : 'bg-gray-200'
                      } relative active:focus-none inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none`}
                  >
                  <span
                      className={`${
                          oneTime ? 'translate-x-6' : 'translate-x-1'
                      } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
                  />
                  </Switch>
                </div>
              </Switch.Group>
            </div>
          </div>

          <div className="mt-10 max-w-md mx-auto">
            <button
              className="w-full rounded-full font-semibold bg-gray-500 text-white py-4 relative disabled:opacity-40"
              type="button"
              disabled={processing}
              onClick={submitForm}
            >
              {!processing && <>{t(`createSecret.submit.label`)}</>}
              {processing && (
              <span className="text-white">
                {t(`createSecret.submit.loading`)}
              </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
